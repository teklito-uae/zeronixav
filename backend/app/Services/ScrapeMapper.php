<?php

namespace App\Services;

use Illuminate\Support\Str;

class ScrapeMapper
{
    /**
     * Normalize a decoded scraped JSON payload into a flat list of product
     * item arrays ready to be persisted as ScrapeItem rows.
     *
     * Tolerant of several shapes:
     *  - [{ category: {...}, products: [...] }, ...]
     *  - [{ ...product... }, ...]                (bare array of products)
     *  - { products: [...] }                      (single wrapper object)
     *  - { ...product... }                        (single bare product)
     */
    public static function mapPayload(array $decodedJson): array
    {
        $products = self::extractProducts($decodedJson);

        $items = [];
        foreach ($products as $product) {
            if (!is_array($product)) {
                continue;
            }
            $items[] = self::mapProduct($product);
        }

        return $items;
    }

    /**
     * Walk the decoded payload and pull out a flat list of raw product arrays.
     */
    protected static function extractProducts(array $decodedJson): array
    {
        // Case: top-level object with a `products` key (associative array).
        if (self::isAssoc($decodedJson) && array_key_exists('products', $decodedJson) && is_array($decodedJson['products'])) {
            return self::extractProducts($decodedJson['products']);
        }

        // Case: top-level object that itself looks like a single product.
        if (self::isAssoc($decodedJson) && (array_key_exists('title', $decodedJson) || array_key_exists('id', $decodedJson))) {
            return [$decodedJson];
        }

        // Case: list of elements — each may be a category wrapper or a bare product.
        $products = [];
        foreach ($decodedJson as $element) {
            if (!is_array($element)) {
                continue;
            }

            if (array_key_exists('products', $element) && is_array($element['products'])) {
                foreach ($element['products'] as $p) {
                    if (is_array($p)) {
                        $products[] = $p;
                    }
                }
                continue;
            }

            if (array_key_exists('title', $element) || array_key_exists('id', $element)) {
                $products[] = $element;
                continue;
            }
        }

        return $products;
    }

    protected static function isAssoc(array $arr): bool
    {
        if ($arr === []) {
            return false;
        }
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    protected static function mapProduct(array $product): array
    {
        $externalId = $product['id'] ?? null;
        $title = (string) ($product['title'] ?? '');
        $rawSku = $product['SKU'] ?? $product['sku'] ?? null;
        $techSpecs = self::extractTechSpecs($product);
        $warranty = self::extractWarranty($product, $techSpecs);

        // Drop the warranty entry from tech specs once it's surfaced as its
        // own field, so it isn't shown twice on the product page.
        foreach (array_keys($techSpecs) as $specName) {
            if (is_string($specName) && preg_match('/warrant/i', $specName)) {
                unset($techSpecs[$specName]);
            }
        }

        return [
            'external_id' => $externalId !== null ? (string) $externalId : null,
            'title' => $title,
            'sku' => $rawSku,
            'model_number' => self::extractModelNumber($title, $rawSku),
            'source_url' => $product['url'] ?? null,
            'brand_name' => self::extractBrandName($product),
            'description' => self::extractDescription($product),
            'overview' => self::extractOverview($product),
            'long_description' => self::extractLongDescription($product),
            'warranty' => $warranty,
            'price' => self::extractPrice($product),
            'stock' => self::extractStock($product),
            'tech_specs' => $techSpecs,
            'source_image_urls' => self::extractImageUrls($product),
            'raw_payload' => $product,
        ];
    }

    /**
     * The raw JSON isn't guaranteed to key the product's write-up as
     * "description" — some sources use a longer-form field name instead.
     */
    protected static function extractDescription(array $product): ?string
    {
        foreach (['description', 'product_description', 'details', 'body_html', 'summary'] as $key) {
            $value = $product[$key] ?? null;
            if (is_string($value) && trim($value) !== '') {
                return trim(strip_tags($value));
            }
        }
        return null;
    }

    /**
     * Short-form product overview, kept distinct from the full description
     * and long-form write-up when the source JSON provides one.
     */
    protected static function extractOverview(array $product): ?string
    {
        foreach (['overview', 'product_overview', 'short_description'] as $key) {
            $value = $product[$key] ?? null;
            if (is_string($value) && trim($value) !== '') {
                return trim(strip_tags($value));
            }
        }
        return null;
    }

    /**
     * The full-length marketing write-up, when the source JSON separates it
     * out from the shorter "description"/"overview" fields.
     */
    protected static function extractLongDescription(array $product): ?string
    {
        foreach (['long_description', 'full_description', 'extended_description'] as $key) {
            $value = $product[$key] ?? null;
            if (is_string($value) && trim($value) !== '') {
                return trim(strip_tags($value));
            }
        }
        return null;
    }

    /**
     * Warranty rarely gets its own top-level JSON key — it's usually one of
     * the free-form "attributes"/"featured_attributes" entries. Check the
     * obvious top-level keys first, then fall back to scanning tech specs
     * (already flattened from attributes) for a warranty-labeled entry.
     *
     * @param array<string, mixed> $techSpecs
     */
    protected static function extractWarranty(array $product, array $techSpecs): ?string
    {
        foreach (['warranty', 'warranty_period', 'warranty_info', 'warranty_details', 'guarantee'] as $key) {
            $value = $product[$key] ?? null;
            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
            if (is_numeric($value)) {
                return (string) $value;
            }
        }

        foreach ($techSpecs as $specName => $specValue) {
            if (is_string($specName) && preg_match('/warrant/i', $specName) && is_scalar($specValue) && trim((string) $specValue) !== '') {
                return trim((string) $specValue);
            }
        }

        return null;
    }

    /**
     * Extract the manufacturer part/model number from the tail of the title,
     * i.e. whatever follows the LAST `|` character. Falls back to the raw
     * scraped SKU/series value when the title has no `|` segment.
     */
    protected static function extractModelNumber(string $title, $rawSku): ?string
    {
        $pos = strrpos($title, '|');
        if ($pos !== false) {
            $tail = trim(substr($title, $pos + 1));
            if ($tail !== '') {
                return $tail;
            }
        }

        return $rawSku !== null && trim((string) $rawSku) !== '' ? $rawSku : null;
    }

    protected static function extractBrandName(array $product): ?string
    {
        foreach (['brand', 'brand_name', 'manufacturer'] as $key) {
            $value = $product[$key] ?? null;
            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        $title = (string) ($product['title'] ?? '');
        $title = trim($title);
        if ($title === '') {
            return null;
        }

        $parts = preg_split('/\s+/', $title);
        $firstWord = $parts[0] ?? '';
        $firstWord = preg_replace('/[^\p{L}\p{N}]+/u', '', $firstWord);

        if ($firstWord === '') {
            return null;
        }

        return Str::title(mb_strtolower($firstWord));
    }

    protected static function extractPrice(array $product): float
    {
        $activeOffer = $product['active_offer'] ?? null;
        if (is_array($activeOffer)) {
            if (isset($activeOffer['price']) && is_numeric($activeOffer['price'])) {
                return (float) $activeOffer['price'];
            }
            if (isset($activeOffer['sale_price']) && is_numeric($activeOffer['sale_price'])) {
                return (float) $activeOffer['sale_price'];
            }
        }

        if (isset($product['price']) && is_numeric($product['price'])) {
            return (float) $product['price'];
        }

        return 0.0;
    }

    protected static function extractStock(array $product): int
    {
        $activeOffer = $product['active_offer'] ?? null;
        if (is_array($activeOffer) && isset($activeOffer['available_qty']) && is_numeric($activeOffer['available_qty'])) {
            return (int) $activeOffer['available_qty'];
        }

        if (isset($product['stock']) && is_numeric($product['stock'])) {
            return (int) $product['stock'];
        }

        return 0;
    }

    protected static function extractTechSpecs(array $product): array
    {
        foreach (['attributes', 'featured_attributes'] as $key) {
            $list = $product[$key] ?? null;
            if (!is_array($list) || empty($list)) {
                continue;
            }

            $specs = [];
            foreach ($list as $entry) {
                if (!is_array($entry)) {
                    continue;
                }

                $name = $entry['name'] ?? $entry['label'] ?? $entry['key'] ?? $entry['attribute'] ?? null;
                $value = $entry['value'] ?? $entry['val'] ?? null;

                if (is_string($name) && trim($name) !== '' && $value !== null) {
                    $specs[trim($name)] = is_scalar($value) ? $value : json_encode($value);
                }
            }

            if (!empty($specs)) {
                return $specs;
            }
        }

        return [];
    }

    protected static function extractImageUrls(array $product): array
    {
        $urls = [];

        $cover = $product['cover_image_url'] ?? null;
        if (is_string($cover) && self::looksLikeUrl($cover)) {
            $urls[] = $cover;
        }

        foreach (['images', 'gallery_images', 'product_images', 'gallery', 'photos', 'media'] as $key) {
            $list = $product[$key] ?? null;
            if (!is_array($list)) {
                continue;
            }

            foreach ($list as $entry) {
                if (is_string($entry) && self::looksLikeUrl($entry)) {
                    $urls[] = $entry;
                    continue;
                }

                if (is_array($entry)) {
                    $candidate = $entry['url'] ?? $entry['src'] ?? $entry['image_url'] ?? null;
                    if (is_string($candidate) && self::looksLikeUrl($candidate)) {
                        $urls[] = $candidate;
                    }
                }
            }
        }

        return array_values(array_unique($urls));
    }

    protected static function looksLikeUrl(string $value): bool
    {
        $value = trim($value);
        return str_starts_with($value, 'http://') || str_starts_with($value, 'https://');
    }
}
