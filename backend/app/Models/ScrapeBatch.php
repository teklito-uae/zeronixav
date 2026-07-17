<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScrapeBatch extends Model
{
    protected $fillable = [
        'category_id',
        'created_by',
        'status',
        'total_items',
        'processed_items',
        'failed_items',
        'error_message',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ScrapeItem::class);
    }
}
