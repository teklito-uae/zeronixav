<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryCrudController extends Controller
{
    /**
     * Display a listing of all categories.
     */
    public function index()
    {
        $categories = Category::withCount('products')->latest()->get();
        return response()->json([
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name',
            'slug' => 'nullable|string|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Category successfully added.',
            'category' => $category
        ], 201);
    }

    /**
     * Display the specified category.
     */
    public function show($id)
    {
        $category = Category::withCount('products')->findOrFail($id);
        return response()->json([
            'category' => $category
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name,' . $category->id,
            'slug' => 'nullable|string|unique:categories,slug,' . $category->id,
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'] ?? $category->parent_id,
        ]);

        return response()->json([
            'message' => 'Category successfully updated.',
            'category' => $category
        ]);
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Category successfully deleted.'
        ]);
    }
}
