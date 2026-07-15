<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    protected $fillable = [
        'sku', 'title', 'slug', 'brand', 'description',
        'price', 'stock', 'category_id', 'tech_specs', 'images',
    ];

    protected $casts = [
        'tech_specs' => 'array',
        'images'     => 'array',
        'price'      => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class);
    }

    /**
     * Get the first image URL from the images JSON array.
     */
    public function getFirstImageAttribute(): ?string
    {
        return $this->images[0] ?? null;
    }
}
