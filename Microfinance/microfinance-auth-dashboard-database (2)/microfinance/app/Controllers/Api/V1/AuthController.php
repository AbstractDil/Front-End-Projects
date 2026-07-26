<?php

namespace App\Controllers\Api\V1;

use App\Services\AuthService;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class AuthController extends BaseApiController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * POST /api/v1/auth/login
     */
    public function login()
    {
        $validation = Services::validation();
        if (!$validation->setRules(config('Validation')->login, config('Validation')->login_errors)
            ->run($this->request->getJSON(true) ?? [])) {
            return $this->validationFailed($validation->getErrors());
        }

        $body = $this->request->getJSON(true);

        $result = $this->authService->login(
            $body['email'],
            $body['password'],
            $this->request->getIPAddress(),
            (string) $this->request->getUserAgent()
        );

        return $this->success($result, 'Login successful.');
    }

    /**
     * POST /api/v1/auth/logout
     * Body: { "refresh_token": "..." } (optional — omit to revoke all sessions)
     */
    public function logout()
    {
        $body = $this->request->getJSON(true) ?? [];
        $this->authService->logout($this->authUserId(), $body['refresh_token'] ?? null);

        return $this->success(null, 'Logged out successfully.');
    }

    /**
     * POST /api/v1/auth/refresh
     * Body: { "refresh_token": "..." }
     * Public endpoint (no access-token filter) — the refresh token itself is the credential.
     */
    public function refresh()
    {
        $validation = Services::validation();
        if (!$validation->setRules(config('Validation')->refreshToken)
            ->run($this->request->getJSON(true) ?? [])) {
            return $this->validationFailed($validation->getErrors());
        }

        $body   = $this->request->getJSON(true);
        $result = $this->authService->refresh(
            $body['refresh_token'],
            $this->request->getIPAddress(),
            (string) $this->request->getUserAgent()
        );

        return $this->success($result, 'Token refreshed.');
    }

    /**
     * POST /api/v1/auth/change-password (authenticated)
     */
    public function changePassword()
    {
        $validation = Services::validation();
        if (!$validation->setRules(config('Validation')->changePassword)
            ->run($this->request->getJSON(true) ?? [])) {
            return $this->validationFailed($validation->getErrors());
        }

        $body = $this->request->getJSON(true);
        $this->authService->changePassword($this->authUserId(), $body['current_password'], $body['new_password']);

        return $this->success(null, 'Password changed successfully. Please log in again.');
    }

    /**
     * POST /api/v1/auth/forgot-password (public)
     * Always returns a generic success message regardless of whether the
     * email exists, to prevent account enumeration.
     */
    public function forgotPassword()
    {
        $validation = Services::validation();
        if (!$validation->setRules(config('Validation')->forgotPassword)
            ->run($this->request->getJSON(true) ?? [])) {
            return $this->validationFailed($validation->getErrors());
        }

        $body = $this->request->getJSON(true);
        $rawToken = $this->authService->forgotPassword($body['email']);

        // TODO: wire to a MailService once notification infrastructure is added.
        // For now the token is only exposed in non-production so the flow is testable end-to-end.
        $data = (ENVIRONMENT !== 'production' && $rawToken) ? ['reset_token' => $rawToken] : null;

        return $this->success($data, 'If that email address is registered, a password reset link has been sent.');
    }

    /**
     * POST /api/v1/auth/reset-password (public)
     */
    public function resetPassword()
    {
        $validation = Services::validation();
        if (!$validation->setRules(config('Validation')->resetPassword)
            ->run($this->request->getJSON(true) ?? [])) {
            return $this->validationFailed($validation->getErrors());
        }

        $body = $this->request->getJSON(true);
        $this->authService->resetPassword($body['token'], $body['new_password']);

        return $this->success(null, 'Password has been reset. Please log in with your new password.');
    }

    /**
     * GET /api/v1/auth/me (authenticated) — quick way for the frontend to
     * fetch the current user's profile + permissions after a page reload.
     */
    public function me()
    {
        $claims = $this->authUser();
        return $this->success([
            'id'          => $claims['sub'],
            'role'        => $claims['role'],
            'branch_id'   => $claims['branch_id'],
            'permissions' => $claims['permissions'],
        ]);
    }
}
