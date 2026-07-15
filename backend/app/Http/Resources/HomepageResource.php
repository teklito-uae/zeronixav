<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class HomepageResource extends JsonResource
{
    public function __construct($resource, protected Collection $spaceTypes = new Collection())
    {
        parent::__construct($resource);
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'services' => ServiceResource::collection($this->resource),
            'space_types' => ServiceResource::collection($this->spaceTypes),
        ];
    }
}
