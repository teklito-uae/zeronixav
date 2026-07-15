<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Http\Resources\HomepageResource;
use Illuminate\Http\JsonResponse;

class HomepageController extends Controller
{
    /**
     * Return optimized payload returning all active services with their top 20
     * linked products pre-fetched to eliminate N+1 database queries.
     */
    public function index(): JsonResponse
    {
        $services = Service::where('type', 'solution')
            ->with(['products' => function ($query) {
                $query->limit(20);
            }])->get();

        $spaceTypes = Service::where('type', 'space_type')->get();

        return response()->json(new HomepageResource($services, $spaceTypes));
    }
}
