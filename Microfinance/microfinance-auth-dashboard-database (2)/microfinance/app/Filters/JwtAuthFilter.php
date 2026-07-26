<?php

namespace App\Filters;

use App\Libraries\AuthContext;
use App\Services\JwtService;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\ExpiredException;
use Throwable;

/**
 * Applied to every protected api/v1 route (see Config\Filters). Verifies the
 * Authorization: Bearer <token> header and, on success, attaches the decoded
 * claims to AuthContext for controllers/services to read via
 * BaseApiController::authUser(). On failure it short-circuits with a 401 —
 * no controller code runs.
 */
class JwtAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return $this->unauthorized('Missing or malformed Authorization header.');
        }

        $token = trim(substr($header, 7));

        try {
            $claims = (new JwtService())->decode($token);
        } catch (ExpiredException $e) {
            return $this->unauthorized('Access token has expired.');
        } catch (Throwable $e) {
            return $this->unauthorized('Invalid access token.');
        }

        if (($claims['type'] ?? null) !== 'access') {
            return $this->unauthorized('Invalid token type.');
        }

        // Attach for downstream controllers/services (see BaseApiController::authUser()).
        AuthContext::set($claims);

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No-op: nothing to clean up post-response.
    }

    private function unauthorized(string $message)
    {
        return service('response')
            ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
            ->setJSON(['status' => false, 'message' => $message]);
    }
}
