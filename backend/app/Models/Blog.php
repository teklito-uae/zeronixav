<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = [
        'title', 'slug', 'content', 'seo_title', 'seo_description', 'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * Scope: only published posts (published_at is set and in the past).
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }
}
