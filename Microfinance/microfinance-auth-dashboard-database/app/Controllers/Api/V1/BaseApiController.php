<?php

namespace App\Controllers\Api\V1;

use App\Libraries\AuthContext;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

/**
 * All Api/V1 controllers extend this. Keeps controllers thin: they call a
 * Service method and hand the result to success()/error(). No business
 * logic belongs here — only request-in/response-out formatting.
 */
abstract class BaseApiController extends ResourceController
{
    protected $format = 'json';

    protected function success($data = null, string $message = 'Success', int $code = ResponseInterface::HTTP_OK)
    {
        return $this->response->setStatusCode($code)->setJSON([
            'status'  => true,
            'message' => $message,
            'data'    => $data,
        ]);
    }

    protected function fail(string $message, int $code = ResponseInterface::HTTP_BAD_REQUEST, array $errors = [])
    {
        $payload = [
            'status'  => false,
            'message' => $message,
        ];
        if ($errors !== []) {
            $payload['errors'] = $errors;
        }

        return $this->response->setStatusCode($code)->setJSON($payload);
    }

    /**
     * Convenience wrapper for the "validation failed" shape used consistently
     * across the API (see API_STANDARDS in the project docs).
     */
    protected function validationFailed(array $errors)
    {
        return $this->fail('Validation failed', ResponseInterface::HTTP_UNPROCESSABLE_ENTITY, $errors);
    }

    /**
     * The authenticated user's claims, set by JwtAuthFilter on the request.
     * Returns null for unauthenticated (public) endpoints.
     */
    protected function authUser(): ?array
    {
        return AuthContext::get();
    }

    protected function authUserId(): ?int
    {
        $user = $this->authUser();
        return $user ? (int) $user['sub'] : null;
    }
}
