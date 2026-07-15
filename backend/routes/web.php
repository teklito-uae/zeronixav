<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'ZeroNix AV Solutions API',
        'version' => '1.0.0',
        'status' => 'operational',
        'endpoints' => [
            'homepage' => '/api/v1/homepage-data',
            'services' => '/api/v1/services',
            'products' => '/api/v1/products',
            'mcp'      => '/api/mcp/products',
            'admin'    => '/admin'
        ]
    ]);
});
