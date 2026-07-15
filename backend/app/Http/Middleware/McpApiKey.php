<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class McpApiKey
{
    /**
     * Validate the X-MCP-Key header against the configured MCP API key.
     * If no key is configured (empty string), the middleware passes through.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = config('services.mcp.api_key');

        // If no key is configured in .env, allow all requests (dev mode)
        if (empty($key)) {
            return $next($request);
        }

        if ($request->header('X-MCP-Key') !== $key) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
