<?php

namespace Config;

use App\Filters\JwtAuthFilter;
use App\Filters\RateLimitFilter;
use App\Filters\RoleFilter;
use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Filters\Cors;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\ForceHTTPS;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\PageCache;
use CodeIgniter\Filters\PerformanceMetrics;
use CodeIgniter\Filters\SecureHeaders;

class Filters extends BaseConfig
{
    public array $aliases = [
        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class,
        'honeypot'      => Honeypot::class,
        'invalidchars'  => InvalidChars::class,
        'secureheaders' => SecureHeaders::class,
        'cors'          => Cors::class,
        'forcehttps'    => ForceHTTPS::class,
        'pagecache'     => PageCache::class,
        'performance'   => PerformanceMetrics::class,

        // Project-specific
        'jwtAuth'    => JwtAuthFilter::class,
        'permission' => RoleFilter::class,
        'ratelimit'  => RateLimitFilter::class,
    ];

    public array $globals = [
        'before' => [
            'cors',
            'invalidchars',
        ],
        'after' => [
            'secureheaders',
        ],
    ];

    public array $methods = [];

    /**
     * Deliberately empty: 'jwtAuth' and 'permission' are applied per route
     * GROUP in Config\Routes instead of globally here. That keeps the public
     * auth endpoints (login, forgot-password, reset-password, refresh) free
     * of the filter without needing an "except" carve-out, and keeps the
     * required permission visible next to each route.
     */
    public array $filters = [];
}
