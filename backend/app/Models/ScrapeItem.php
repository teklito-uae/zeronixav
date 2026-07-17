<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScrapeItem extends Model
{
    protected $fillable = [
        'scrape_batch_id',
        'product_id',
        'external_id',
        'title',
        'sku',
        'model_number',
        'source_url',
        'brand_name',
        'description',
        'overview',
        'long_description',
        'warranty',
        'price',
        'stock',
        'tech_specs',
        'source_image_urls',
        'stored_image_urls',
        'raw_payload',
        'status',
        'status_message',
        'error_message',
    ];

    protected $casts = [
        'tech_specs' => 'array',
        'source_image_urls' => 'array',
        'stored_image_urls' => 'array',
        'raw_payload' => 'array',
        'price' => 'decimal:2',
    ];

    public function batch(): BelongsTo
    {
        return $this->belongsTo(ScrapeBatch::class, 'scrape_batch_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
