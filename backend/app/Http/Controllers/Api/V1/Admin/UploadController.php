<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Store an uploaded product image on the public disk and return its URL.
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
        ]);

        $path = $request->file('file')->store('products', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
