<?php

namespace App\Jobs;

use App\Models\Brand;
use App\Models\Product;
use App\Models\ScrapeBatch;
use App\Models\ScrapeItem;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ProcessScrapeItem implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 10;

    public function __construct(public int $scrapeItemId)
    {
    }

    public function handle(): void
    {
        $item = ScrapeItem::find($this->scrapeItemId);

        if (!$item || !in_array($item->status, ['pending', 'processing'], true)) {
            return;
        }

        if ($item->batch?->status === 'cancelled') {
            $item->status = 'skipped';
            $item->status_message = null;
            $item->save();
            return;
        }

        $item->status = 'processing';
        $item->status_message = 'Resolving brand…';
        $item->save();

        try {
            $brandName = trim((string) $item->brand_name) ?: 'Unbranded';
            $brand = Brand::firstOrCreate(
                ['name' => $brandName],
                ['slug' => Str::slug($brandName)]
            );

            $item->status_message = 'Fetching product gallery…';
            $item->save();

            // The JSON's cover_image_url (mapped first by ScrapeMapper) is
            // always our product's cover image, guaranteed — never dropped
            // even if the gallery page fetch below finds nothing.
            $coverUrl = $item->source_image_urls[0] ?? null;

            $galleryUrls = [];
            try {
                $galleryUrls = $this->fetchGalleryImageUrls($item->source_url);
            } catch (Throwable $e) {
                Log::warning('ScrapeItem gallery fetch failed, falling back to cover image only', [
                    'item_id' => $item->id,
                    'error' => $e->getMessage(),
                ]);
            }

            $mergedImageUrls = array_values(array_unique(array_filter(array_merge(
                $coverUrl ? [$coverUrl] : [],
                $galleryUrls
            ))));
            $item->source_image_urls = $mergedImageUrls;
            $item->save();

            $imageCount = count($mergedImageUrls);
            $item->status_message = "Downloading {$imageCount} image(s)…";
            $item->save();

            $storedUrls = $this->downloadImages($item, $mergedImageUrls);

            $item->status_message = 'Saving product…';
            $item->save();

            $product = $this->upsertProduct($item, $brand, $storedUrls);

            $item->product_id = $product->id;
            $item->stored_image_urls = $storedUrls;
            $item->status = 'done';
            $item->status_message = null;
            $item->error_message = null;
            $item->save();
        } catch (Throwable $e) {
            $item->status = 'failed';
            $item->error_message = Str::limit($e->getMessage(), 1000);
            $item->save();

            Log::error('ScrapeItem failed', [
                'item_id' => $item->id,
                'error' => $e->getMessage(),
            ]);
        } finally {
            $this->recomputeBatchCounters($item->scrape_batch_id);
        }
    }

    /**
     * Fetch the product's own detail page and extract ONLY that product's
     * gallery photos — not icons, logos, related-product thumbnails, or
     * other variants' cover images that also appear elsewhere on the page.
     *
     * The source site (a microless.com-style storefront) marks each of a
     * product's own gallery photos with a dedicated lightbox anchor:
     *   <a class="elem image lightbox-opener" data-type="image"
     *      href="https://.../cdn/products/{hash}-hi.jpg" title="product image">
     * Verified against multiple real product pages: this is the only
     * reliable way to distinguish this product's own photos from the many
     * other product-image URLs a page like this also contains (a variant
     * switcher's `Microless.variant_covers` JS map, a "recently viewed"
     * carousel, etc.) — a blind whole-page image-URL scan pulls in all of
     * those too, which is exactly the "wrong photos" bug this replaces.
     *
     * Never throws in a way that should fail the parent item — failures
     * here just mean we fall back to the JSON's cover_image_url alone.
     */
    protected function fetchGalleryImageUrls(?string $sourceUrl): array
    {
        if (empty($sourceUrl)) {
            return [];
        }

        $response = Http::timeout(20)->get($sourceUrl);

        if (!$response->successful()) {
            Log::warning('ScrapeItem gallery page fetch failed (non-success response)', [
                'url' => $sourceUrl,
                'status' => $response->status(),
            ]);
            return [];
        }

        $html = $response->body();
        $urls = [];

        if (preg_match_all(
            '/<a\b(?=[^>]*\bclass=["\'][^"\']*\blightbox-opener\b)(?=[^>]*\bhref=["\']([^"\']+)["\'])(?=[^>]*\btitle=["\']product image["\'])[^>]*>/i',
            $html,
            $matches
        )) {
            $urls = $matches[1];
        }

        $urls = array_values(array_unique(array_filter($urls, fn ($u) => str_starts_with($u, 'http'))));

        return array_slice($urls, 0, 15);
    }

    /**
     * Called by Laravel when all retries have been exhausted (e.g. the job
     * died mid-flight before the try/catch in handle() could run).
     */
    public function failed(Throwable $exception): void
    {
        $item = ScrapeItem::find($this->scrapeItemId);

        if (!$item) {
            return;
        }

        if ($item->status !== 'done') {
            $item->status = 'failed';
            $item->error_message = Str::limit($exception->getMessage(), 1000);
            $item->save();
        }

        Log::error('ScrapeItem failed (job failed callback)', [
            'item_id' => $item->id,
            'error' => $exception->getMessage(),
        ]);

        $this->recomputeBatchCounters($item->scrape_batch_id);
    }

    /**
     * @param array<int, string> $urls
     * @return array<int, string>
     */
    protected function downloadImages(ScrapeItem $item, array $urls): array
    {
        $stored = [];
        $total = count($urls);
        $i = 0;

        foreach ($urls as $url) {
            $i++;

            if (!is_string($url) || trim($url) === '') {
                continue;
            }

            $item->status_message = "Downloading image {$i}/{$total}…";
            $item->save();

            try {
                $response = Http::timeout(20)->get($url);

                if (!$response->successful()) {
                    Log::warning('ScrapeItem image download failed (non-success response)', [
                        'url' => $url,
                        'status' => $response->status(),
                    ]);
                    continue;
                }

                $contentType = $response->header('Content-Type') ?? '';
                if (!str_starts_with($contentType, 'image/')) {
                    Log::warning('ScrapeItem image download skipped (not an image content-type)', [
                        'url' => $url,
                        'content_type' => $contentType,
                    ]);
                    continue;
                }

                $extension = $this->guessExtension($contentType, $url);
                $filename = Str::uuid() . '.' . $extension;

                Storage::disk('public')->put('products/scraped/' . $filename, $response->body());
                $stored[] = Storage::disk('public')->url('products/scraped/' . $filename);
            } catch (Throwable $e) {
                Log::warning('ScrapeItem image download failed (exception)', [
                    'url' => $url,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $stored;
    }

    protected function guessExtension(string $contentType, string $url): string
    {
        $map = [
            'image/jpeg' => 'jpg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/bmp' => 'bmp',
            'image/svg+xml' => 'svg',
        ];

        $contentType = strtolower(trim(explode(';', $contentType)[0]));
        if (isset($map[$contentType])) {
            return $map[$contentType];
        }

        $path = parse_url($url, PHP_URL_PATH) ?? '';
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'], true)) {
            return $ext === 'jpeg' ? 'jpg' : $ext;
        }

        return 'jpg';
    }

    /**
     * @param array<int, string> $storedUrls
     */
    protected function upsertProduct(ScrapeItem $item, Brand $brand, array $storedUrls): Product
    {
        $product = null;
        if (!empty($item->model_number)) {
            $product = Product::where('model_number', $item->model_number)->first();
        }

        $isCreate = !$product;

        if ($isCreate) {
            $sku = 'ZX-' . str_pad((string) $item->id, 6, '0', STR_PAD_LEFT);
            $slug = $this->buildUniqueSlug($item);

            $product = new Product();
            $product->sku = $sku;
            $product->slug = $slug;
        }

        $product->title = $item->title;
        $product->brand = $brand->name;
        $product->model_number = $item->model_number;
        $product->description = $item->description;
        $product->overview = $item->overview;
        $product->long_description = $item->long_description;
        $product->warranty = $item->warranty;
        $product->price = $item->price ?? 0;
        $product->stock = $item->stock ?? 0;
        $product->category_id = $item->batch->category_id;
        $product->tech_specs = array_filter(array_merge(
            $item->tech_specs ?? [],
            $item->sku ? ['Series' => $item->sku] : []
        ));

        if (!empty($storedUrls)) {
            $product->images = $storedUrls;
        } elseif ($isCreate) {
            $product->images = [];
        }
        // else: updating an existing product with no newly downloaded images — keep existing images.

        $product->save();

        return $product;
    }

    protected function buildUniqueSlug(ScrapeItem $item): string
    {
        $anchor = $item->model_number ?: ($item->external_id ?: $item->id);

        // Leave headroom for the "-{item->id}" disambiguation suffix below —
        // the products.slug column is varchar(191), and real scraped titles
        // routinely produce slugs well past that on their own.
        $suffix = '-' . $item->id;
        $maxBaseLength = 191 - strlen($suffix);

        $base = Str::limit(Str::slug($anchor . '-' . $item->title), $maxBaseLength, '');
        $base = rtrim($base, '-');

        $existing = Product::where('slug', $base)->first();
        if ($existing) {
            return Str::limit($base, $maxBaseLength, '') . $suffix;
        }

        return $base;
    }

    protected function recomputeBatchCounters(int $batchId): void
    {
        DB::transaction(function () use ($batchId) {
            $batch = ScrapeBatch::where('id', $batchId)->lockForUpdate()->first();

            if (!$batch) {
                return;
            }

            $processed = ScrapeItem::where('scrape_batch_id', $batchId)
                ->whereIn('status', ['done', 'skipped'])
                ->count();

            $failed = ScrapeItem::where('scrape_batch_id', $batchId)
                ->where('status', 'failed')
                ->count();

            $batch->processed_items = $processed;
            $batch->failed_items = $failed;

            // A batch the admin explicitly cancelled must stay cancelled — a
            // straggling item that was already mid-flight when Stop was
            // clicked can still finish afterward and land here, but it must
            // not flip the batch back to completed/running behind the
            // admin's back.
            if ($batch->status !== 'cancelled') {
                if (($processed + $failed) >= $batch->total_items) {
                    $batch->status = $failed === 0 ? 'completed' : 'completed_with_errors';
                } else {
                    $batch->status = 'running';
                }
            }

            $batch->save();
        });
    }
}
