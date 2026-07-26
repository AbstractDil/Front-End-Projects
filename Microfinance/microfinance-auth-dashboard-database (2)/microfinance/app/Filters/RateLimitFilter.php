<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Fixed-window rate limiter keyed by IP + route, backed by CI4's cache
 * driver (file cache by default; swap to Redis in Config\Cache for a
 * multi-server deployment). Applied to login/forgot-password routes to
 * blunt credential-stuffing and enumeration attacks.
 */
class RateLimitFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $limit  = (int) ($arguments[0] ?? env('RATE_LIMIT_LOGIN_PER_MIN', 10));
        $window = 60; // seconds

        $cache = \Config\Services::cache();
        $key   = 'ratelimit_' . md5($request->getIPAddress() . '_' . $request->getUri()->getPath());

        $attempts = (int) ($cache->get($key) ?? 0);

        if ($attempts >= $limit) {
            return service('response')->setStatusCode(429)->setJSON([
                'status'  => false,
                'message' => 'Too many requests. Please wait a moment before trying again.',
            ]);
        }

        $cache->save($key, $attempts + 1, $window);

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No-op.
    }
}
