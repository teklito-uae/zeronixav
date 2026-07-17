<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessScrapeItem;
use App\Models\ScrapeBatch;
use App\Models\ScrapeItem;
use App\Services\ScrapeMapper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScrapeBatchController extends Controller
{
    /**
     * List all scrape batches, most recent first.
     */
    public function index()
    {
        $batches = ScrapeBatch::with('category')->latest()->get();

        return response()->json([
            'batches' => $batches,
        ]);
    }

    /**
     * Parse pasted scraper JSON for a category and create a draft batch
     * with its mapped preview items.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'json' => 'required|string',
        ]);

        $decoded = json_decode($validated['json'], true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'message' => 'Invalid JSON: ' . json_last_error_msg(),
            ], 422);
        }

        $mapped = ScrapeMapper::mapPayload(is_array($decoded) ? $decoded : []);

        if (empty($mapped)) {
            return response()->json([
                'message' => 'No products could be parsed from this JSON.',
            ], 422);
        }

        $batch = DB::transaction(function () use ($validated, $mapped, $request) {
            $batch = ScrapeBatch::create([
                'category_id' => $validated['category_id'],
                'created_by' => $request->user()->id,
                'status' => 'draft',
                'total_items' => count($mapped),
            ]);

            $now = now();
            $rows = array_map(function ($item) use ($batch, $now) {
                return [
                    'scrape_batch_id' => $batch->id,
                    'external_id' => $item['external_id'],
                    'title' => $item['title'],
                    'sku' => $item['sku'],
                    'model_number' => $item['model_number'],
                    'source_url' => $item['source_url'],
                    'brand_name' => $item['brand_name'],
                    'description' => $item['description'],
                    'overview' => $item['overview'],
                    'long_description' => $item['long_description'],
                    'warranty' => $item['warranty'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'tech_specs' => json_encode($item['tech_specs']),
                    'source_image_urls' => json_encode($item['source_image_urls']),
                    'raw_payload' => json_encode($item['raw_payload']),
                    'status' => 'pending',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $mapped);

            ScrapeItem::insert($rows);

            return $batch;
        });

        return response()->json([
            'batch' => $batch,
            'items' => $batch->items,
        ], 201);
    }

    /**
     * Polling endpoint: current batch state plus all of its items.
     */
    public function show(ScrapeBatch $batch)
    {
        return response()->json([
            'batch' => $batch->load('category'),
            'items' => $batch->items,
        ]);
    }

    /**
     * Edit a single preview row before the batch is run. Only allowed
     * while the batch is still in draft.
     */
    public function updateItem(Request $request, ScrapeBatch $batch, ScrapeItem $item)
    {
        abort_if($item->scrape_batch_id !== $batch->id, 404);

        if ($batch->status !== 'draft') {
            return response()->json([
                'message' => 'Batch is no longer editable.',
            ], 422);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'sku' => 'sometimes|nullable|string',
            'model_number' => 'sometimes|nullable|string',
            'brand_name' => 'sometimes|nullable|string',
            'description' => 'sometimes|nullable|string',
            'overview' => 'sometimes|nullable|string',
            'long_description' => 'sometimes|nullable|string',
            'warranty' => 'sometimes|nullable|string',
            'price' => 'sometimes|nullable|numeric',
            'stock' => 'sometimes|nullable|integer',
            'source_image_urls' => 'sometimes|nullable|array',
            'source_image_urls.*' => 'string',
        ]);

        $item->update($validated);

        return response()->json([
            'item' => $item,
        ]);
    }

    /**
     * Queue background jobs to download images and upsert products for
     * every eligible item in the batch.
     */
    public function run(Request $request, ScrapeBatch $batch)
    {
        if (!in_array($batch->status, ['draft', 'completed_with_errors', 'failed', 'cancelled'], true)) {
            return response()->json([
                'message' => 'Batch already running or completed.',
            ], 422);
        }

        $eligibleItems = $batch->items()->whereIn('status', ['pending', 'failed', 'skipped'])->get();

        DB::transaction(function () use ($batch, $eligibleItems) {
            $failedRetryCount = $eligibleItems->where('status', 'failed')->count();
            $skippedRetryCount = $eligibleItems->where('status', 'skipped')->count();

            if ($failedRetryCount > 0) {
                ScrapeItem::where('scrape_batch_id', $batch->id)
                    ->where('status', 'failed')
                    ->update(['status' => 'pending', 'error_message' => null]);

                $batch->failed_items = max(0, $batch->failed_items - $failedRetryCount);
            }

            if ($skippedRetryCount > 0) {
                ScrapeItem::where('scrape_batch_id', $batch->id)
                    ->where('status', 'skipped')
                    ->update(['status' => 'pending', 'status_message' => null]);

                $batch->processed_items = max(0, $batch->processed_items - $skippedRetryCount);
            }

            $batch->status = 'queued';
            $batch->save();
        });

        foreach ($eligibleItems as $item) {
            ProcessScrapeItem::dispatch($item->id);
        }

        return response()->json([
            'batch' => $batch->fresh(),
        ]);
    }

    /**
     * Cancel an in-progress batch: any items still pending are marked
     * skipped so no further jobs process them, and the batch itself is
     * marked cancelled. Items already done/failed are left untouched.
     */
    public function stop(ScrapeBatch $batch)
    {
        if (!in_array($batch->status, ['queued', 'running'], true)) {
            return response()->json([
                'message' => 'Batch is not currently running.',
            ], 422);
        }

        DB::transaction(function () use ($batch) {
            $batch->items()->where('status', 'pending')->update([
                'status' => 'skipped',
                'status_message' => null,
            ]);

            $processed = $batch->items()->whereIn('status', ['done', 'skipped'])->count();
            $failed = $batch->items()->where('status', 'failed')->count();

            $batch->processed_items = $processed;
            $batch->failed_items = $failed;
            $batch->status = 'cancelled';
            $batch->save();
        });

        return response()->json([
            'batch' => $batch->fresh(),
        ]);
    }

    /**
     * Permanently remove a batch and its items. The FK on
     * scrape_items.scrape_batch_id cascades the item deletion at the
     * database level, so no manual item cleanup is needed here. Products
     * already created from this batch's items are never touched.
     */
    public function destroy(ScrapeBatch $batch)
    {
        if (in_array($batch->status, ['queued', 'running'], true)) {
            return response()->json([
                'message' => 'Stop the batch before deleting it.',
            ], 422);
        }

        $batch->delete();

        return response()->json([
            'message' => 'Batch deleted.',
        ]);
    }
}
