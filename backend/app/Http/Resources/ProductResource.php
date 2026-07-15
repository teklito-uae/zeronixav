<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'title' => $this->title,
            'slug' => $this->slug,
            'brand' => $this->brand,
            'description' => $this->description,
            'price' => (string) $this->price,
            'stock' => (int) $this->stock,
            'category_id' => $this->category_id,
            'tech_specs' => $this->tech_specs ?? (object)[],
            'images' => $this->images ?? [],
            'first_image' => $this->first_image,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
