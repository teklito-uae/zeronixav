<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BannerController extends Controller
{
    /**
     * Return active banners for the requested GCC country, falling back to
     * the default/global set (country_code null) when none are targeted.
     */
    public function index(Request $request): JsonResponse
    {
        $country = strtolower((string) $request->query('country', ''));
        $validCodes = array_keys(config('countries.list'));

        $banners = in_array($country, $validCodes, true)
            ? Banner::active()->where('country_code', $country)->get()
            : collect();

        if ($banners->isEmpty()) {
            $banners = Banner::active()->whereNull('country_code')->get();
        }

        return response()->json(['banners' => $banners]);
    }
}
