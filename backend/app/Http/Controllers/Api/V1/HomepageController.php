<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Http\Resources\HomepageResource;
use Illuminate\Http\JsonResponse;

class HomepageController extends Controller
{
    /**
     * Return the lightweight homepage payload: service and space-type metadata
     * only. The homepage's product carousels are driven separately, by category,
     * via ProductController::index as each section scrolls into view.
     */
    public function index(): JsonResponse
    {
        $services = Service::where('type', 'solution')->get();
        $spaceTypes = Service::where('type', 'space_type')->get();

        return response()->json(new HomepageResource($services, $spaceTypes));
    }
}
