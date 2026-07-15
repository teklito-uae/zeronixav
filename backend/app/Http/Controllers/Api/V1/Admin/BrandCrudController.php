<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandCrudController extends Controller
{
    /**
     * Display a listing of all brands.
     */
    public function index()
    {
        $brands = Brand::withCount('products')->latest()->get();
        return response()->json([
            'brands' => $brands
        ]);
    }

    /**
     * Store a newly created brand in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:brands,name',
            'country' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $brand = Brand::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'country' => $validated['country'] ?? 'Global',
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'AV Brand successfully added.',
            'brand' => $brand
        ], 201);
    }

    /**
     * Display the specified brand.
     */
    public function show($id)
    {
        $brand = Brand::withCount('products')->findOrFail($id);
        return response()->json([
            'brand' => $brand
        ]);
    }

    /**
     * Update the specified brand in storage.
     */
    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:brands,name,' . $brand->id,
            'country' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $brand->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'country' => $validated['country'] ?? $brand->country,
            'description' => $validated['description'] ?? $brand->description,
            'is_active' => $validated['is_active'] ?? $brand->is_active,
        ]);

        return response()->json([
            'message' => 'Brand details successfully updated.',
            'brand' => $brand
        ]);
    }

    /**
     * Remove the specified brand from storage.
     */
    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        $brand->delete();

        return response()->json([
            'message' => 'AV Brand deleted from directory.'
        ]);
    }
}
