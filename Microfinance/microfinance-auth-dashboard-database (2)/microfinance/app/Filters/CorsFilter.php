<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Self-contained CORS filter — replaces the framework's built-in
 * CodeIgniter\Filters\Cors, which requires a separate Config\Cors.php that
 * this project doesn't ship. Handles preflight (OPTIONS) requests directly
 * and stamps CORS headers on every response.
 *
 * Configure allowed origins via the CORS_ALLOWED_ORIGINS env var
 * (comma-separated), e.g.:
 *   CORS_ALLOWED_ORIGINS = http://localhost:8080,https://app.example.com
 * Leave unset in local development to allow all origins ('*').
 */
class CorsFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $this->applyHeaders($request);

        // Preflight requests get an empty 204 response immediately —
        // they never need to reach a controller.
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return service('response')
                ->setStatusCode(204)
                ->setBody('');
        }

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $this->applyHeaders($request, $response);
        return $response;
    }

    private function applyHeaders(RequestInterface $request, ?ResponseInterface $response = null): void
    {
        $response ??= service('response');

        $origin        = $request->getHeaderLine('Origin');
        $allowedConfig = trim((string) env('CORS_ALLOWED_ORIGINS', ''));

        if ($allowedConfig === '') {
            // No allow-list configured — permit any origin (fine for local dev;
            // set CORS_ALLOWED_ORIGINS explicitly in production).
            $allowOrigin = $origin !== '' ? $origin : '*';
        } else {
            $allowedOrigins = array_map('trim', explode(',', $allowedConfig));
            $allowOrigin    = in_array($origin, $allowedOrigins, true) ? $origin : 'null';
        }

        $response->setHeader('Access-Control-Allow-Origin', $allowOrigin);
        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, X-Requested-With');
        $response->setHeader('Access-Control-Max-Age', '3600');
        $response->setHeader('Vary', 'Origin');
    }
}
