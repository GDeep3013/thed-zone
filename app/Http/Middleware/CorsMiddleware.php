<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $origin = $request->headers->get('Origin');

        // Define the allowed origins
        $allowedOrigins = [
            'https://thed.zone',
            'https://thed-zone.myshopify.com'
        ];

        // Check if the request origin is allowed
        if (in_array($origin, $allowedOrigins)) {
            $response = $next($request);

            // Set CORS headers
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        } else {
            // If the origin is not allowed, proceed with the normal request flow
            $response = $next($request);
        }

        return $response;
    }
}
