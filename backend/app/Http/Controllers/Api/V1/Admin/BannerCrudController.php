<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerCrudController extends Controller
{
    private function countryRule(): string
    {
        return 'nullable|in:' . implode(',', array_keys(config('countries.list')));
    }

    /**
     * Display a listing of all banners.
     */
    public function index()
    {
        $banners = Banner::orderBy('sort_order')->latest()->get();
        return response()->json([
            'banners' => $banners
        ]);
    }

    /**
     * Store a newly created banner in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'country_code' => $this->countryRule(),
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $banner = Banner::create([
            'title' => $validated['title'],
            'image_url' => $validated['image_url'],
            'link_url' => $validated['link_url'] ?? null,
            'country_code' => $validated['country_code'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Banner successfully added.',
            'banner' => $banner
        ], 201);
    }

    /**
     * Display the specified banner.
     */
    public function show($id)
    {
        $banner = Banner::findOrFail($id);
        return response()->json([
            'banner' => $banner
        ]);
    }

    /**
     * Update the specified banner in storage.
     */
    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'country_code' => $this->countryRule(),
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $banner->update([
            'title' => $validated['title'],
            'image_url' => $validated['image_url'],
            'link_url' => $validated['link_url'] ?? null,
            'country_code' => $validated['country_code'] ?? null,
            'sort_order' => $validated['sort_order'] ?? $banner->sort_order,
            'is_active' => $validated['is_active'] ?? $banner->is_active,
        ]);

        return response()->json([
            'message' => 'Banner successfully updated.',
            'banner' => $banner
        ]);
    }

    /**
     * Remove the specified banner from storage.
     */
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return response()->json([
            'message' => 'Banner deleted.'
        ]);
    }
}
