<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'type' => $this->type,
            'summary' => $this->summary,
            'content' => $this->content,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'keywords' => $this->keywords,
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'faqs' => ServiceFaqResource::collection($this->whenLoaded('faqs')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
