<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Service;
use App\Http\Resources\ServiceResource;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /**
     * Display a paginated listing of services.
     */
    public function index(): JsonResponse
    {
        $services = Service::withCount('products')->paginate(15);
        return response()->json(ServiceResource::collection($services)->response()->getData());
    }

    /**
     * Display the specified service, resolving only the products referenced by
     * [[products:...]] snippets in its content — that's what the page actually renders.
     */
    public function show(string $slug): JsonResponse
    {
        $service = Service::with('faqs')->where('slug', $slug)->firstOrFail();

        $productIds = Service::extractProductIds($service->content);
        $service->setRelation('products', $productIds
            ? Product::whereIn('id', $productIds)->get()
            : collect());

        return response()->json(new ServiceResource($service));
    }
}
