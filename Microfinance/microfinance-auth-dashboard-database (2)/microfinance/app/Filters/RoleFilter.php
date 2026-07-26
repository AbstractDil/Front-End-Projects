<?php

namespace App\Filters;

use App\Libraries\AuthContext;
use App\Services\AuthService;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Runs AFTER JwtAuthFilter in the filter chain (see Config\Filters) and
 * checks that the authenticated user's role carries the permission passed
 * as a filter argument, e.g. `'permission:customers.create'` on a route.
 * Admin bypasses all permission checks by design (role slug 'admin').
 */
class RoleFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $claims = AuthContext::get();

        if (!$claims) {
            // Should never happen if JwtAuthFilter ran first, but fail closed.
            return service('response')->setStatusCode(401)->setJSON([
                'status' => false, 'message' => 'Unauthenticated.',
            ]);
        }

        if (($claims['role'] ?? null) === 'admin') {
            return $request;
        }

        $requiredPermission = $arguments[0] ?? null;
        if ($requiredPermission === null) {
            return $request; // Filter used without an argument = auth-only, no specific permission required.
        }

        $authService = new AuthService();
        if (!$authService->userHasPermission($claims, $requiredPermission)) {
            return service('response')->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => "You do not have permission to perform this action ({$requiredPermission}).",
            ]);
        }

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No-op.
    }
}
