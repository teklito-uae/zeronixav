<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\HomepageController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\BannerController;
use App\Http\Controllers\Api\Mcp\McpProductController;
use App\Http\Middleware\McpApiKey;

/*
|--------------------------------------------------------------------------
| API Routes — ZeroNix AV Decoupled Platform
|--------------------------------------------------------------------------
|
| Versioned RESTful endpoints (v1) consumed by React 18 / Vite frontend,
| and dedicated MCP read-only endpoints consumed by AI configuration agents.
|
*/

Route::prefix('v1')->group(function () {
    // Optimized homepage payload: all active services with top 10 linked products pre-fetched
    Route::get('/homepage-data', [HomepageController::class, 'index']);

    // Services Catalog
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{slug}', [ServiceController::class, 'show']);

    // Products Catalog with filtration (category, brand, price range, pagination)
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/filters', [ProductController::class, 'filters']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    // Public Categories & Brands lookup
    Route::get('/categories', [\App\Http\Controllers\Api\V1\Admin\CategoryCrudController::class, 'index']);
    Route::get('/brands', [\App\Http\Controllers\Api\V1\Admin\BrandCrudController::class, 'index']);

    // Country-targeted homepage banners (falls back to default/global set)
    Route::get('/banners', [BannerController::class, 'index']);

    // Admin Console Endpoints
    Route::prefix('admin')->group(function () {
        Route::post('/login', [\App\Http\Controllers\Api\V1\Admin\AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [\App\Http\Controllers\Api\V1\Admin\AuthController::class, 'me']);
            Route::post('/logout', [\App\Http\Controllers\Api\V1\Admin\AuthController::class, 'logout']);

            // Image upload for product galleries (device uploads); stores file and returns its URL
            Route::post('/uploads', [\App\Http\Controllers\Api\V1\Admin\UploadController::class, 'store']);

            // Full RESTful CRUD endpoints for Admin Live Inventory
            Route::apiResource('products', \App\Http\Controllers\Api\V1\Admin\ProductCrudController::class);
            Route::apiResource('categories', \App\Http\Controllers\Api\V1\Admin\CategoryCrudController::class);
            Route::apiResource('brands', \App\Http\Controllers\Api\V1\Admin\BrandCrudController::class);
            Route::apiResource('banners', \App\Http\Controllers\Api\V1\Admin\BannerCrudController::class);
        });
    });
});

/*
|--------------------------------------------------------------------------
| Model Context Protocol (MCP) Endpoints
|--------------------------------------------------------------------------
|
| Lightweight, semantic-optimized JSON outputs designed specifically for
| LLM tool consumption. Protected by X-MCP-Key header authentication.
|
*/

Route::prefix('mcp')->middleware([McpApiKey::class])->group(function () {
    Route::get('/products', [McpProductController::class, 'index']);
});
