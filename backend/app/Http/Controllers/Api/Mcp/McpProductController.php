<?php

namespace App\Http\Controllers\Api\Mcp;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class McpProductController extends Controller
{
    /**
     * Model Context Protocol (MCP) Read-Only Endpoint for LLM consumption.
     * Returns a lightweight, structured JSON array without UI overhead.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('services:id,title,slug');

        if ($request->filled('query')) {
            $search = $request->query('query');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->limit(20)->get()->map(function ($product) {
            return [
                'sku' => $product->sku,
                'title' => $product->title,
                'brand' => $product->brand,
                'tech_specs' => $product->tech_specs ?? (object)[],
                'compatible_services' => $product->services->pluck('title')->toArray(),
            ];
        });

        return response()->json($products);
    }
}
