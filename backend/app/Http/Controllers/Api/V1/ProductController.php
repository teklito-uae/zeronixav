<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Display a paginated listing of products with sidebar filtration by category or brand.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category)->orWhere('id', $request->category);
            });
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(24);
        return response()->json(ProductResource::collection($products)->response()->getData());
    }

    /**
     * Return the price bounds across all products, used by the catalog page
     * to size its price-range filter.
     */
    public function filters(): JsonResponse
    {
        return response()->json([
            'price_min' => (float) (Product::min('price') ?? 0),
            'price_max' => (float) (Product::max('price') ?? 0),
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::with('category', 'services')->where('slug', $slug)->orWhere('sku', $slug)->firstOrFail();
        return response()->json(new ProductResource($product));
    }
}
