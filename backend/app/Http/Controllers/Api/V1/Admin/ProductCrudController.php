<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductCrudController extends Controller
{
    /**
     * Display a listing of all hardware SKUs.
     */
    public function index(Request $request)
    {
        $query = Product::with('category')->latest();

        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('sku', 'like', "%{$s}%")
                  ->orWhere('title', 'like', "%{$s}%")
                  ->orWhere('brand', 'like', "%{$s}%");
            });
        }

        if ($request->has('brand') && $request->brand !== 'All' && !empty($request->brand)) {
            $query->where('brand', $request->brand);
        }

        return response()->json([
            'products' => $query->get()
        ]);
    }

    /**
     * Store a newly created hardware SKU in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|string|unique:products,sku',
            'title' => 'required|string',
            'brand' => 'required|string',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id',
            'tech_specs' => 'nullable|array',
            'description' => 'nullable|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'nullable|string|max:2048',
        ]);

        $product = Product::create([
            'sku' => $validated['sku'],
            'title' => $validated['title'],
            'slug' => Str::slug($validated['sku'] . '-' . $validated['title']),
            'brand' => $validated['brand'],
            'price' => $validated['price'] ?? 0.00,
            'stock' => $validated['stock'] ?? 0,
            'category_id' => $validated['category_id'] ?? null,
            'tech_specs' => $validated['tech_specs'] ?? [],
            'description' => $validated['description'] ?? null,
            'images' => array_values(array_filter($validated['images'] ?? [])),
        ]);

        return response()->json([
            'message' => 'Hardware SKU successfully added to repository.',
            'product' => $product
        ], 201);
    }

    /**
     * Display the specified hardware SKU.
     */
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return response()->json([
            'product' => $product
        ]);
    }

    /**
     * Update the specified hardware SKU in storage.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'title' => 'required|string',
            'brand' => 'required|string',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id',
            'tech_specs' => 'nullable|array',
            'description' => 'nullable|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'nullable|string|max:2048',
        ]);

        $product->update([
            'sku' => $validated['sku'],
            'title' => $validated['title'],
            'brand' => $validated['brand'],
            'price' => $validated['price'] ?? $product->price,
            'stock' => $validated['stock'] ?? $product->stock,
            'category_id' => $validated['category_id'] ?? $product->category_id,
            'tech_specs' => $validated['tech_specs'] ?? $product->tech_specs,
            'description' => $validated['description'] ?? $product->description,
            'images' => array_key_exists('images', $validated)
                ? array_values(array_filter($validated['images']))
                : $product->images,
        ]);

        return response()->json([
            'message' => 'Hardware SKU successfully updated.',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified hardware SKU from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Hardware SKU deleted from repository.'
        ]);
    }
}
