<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'title', 'slug', 'summary', 'content', 'seo_title', 'seo_description', 'keywords',
    ];

    protected $casts = [
        'keywords' => 'array',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(ServiceFaq::class)->orderBy('sort_order');
    }

    /**
     * Unique product IDs referenced by [[products:1,2,3]] snippets embedded in the content body.
     * The content snippet is the sole source of truth for which products render on the page —
     * the products() pivot is a separate admin-curation list and does not drive frontend display.
     *
     * @return int[]
     */
    public static function extractProductIds(?string $content): array
    {
        if (! $content) {
            return [];
        }

        preg_match_all('/\[\[products:([\d,\s]+)]]/', $content, $matches);

        return collect($matches[1] ?? [])
            ->flatMap(fn (string $group) => explode(',', $group))
            ->map(fn (string $id) => (int) trim($id))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}
