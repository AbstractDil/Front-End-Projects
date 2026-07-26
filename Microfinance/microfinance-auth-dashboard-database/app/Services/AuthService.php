<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\RefreshTokenModel;
use App\Models\RoleModel;
use App\Models\UserModel;
use Config\Auth as AuthConfig;

/**
 * All authentication + authorization business rules live here. Controllers
 * only translate HTTP <-> service calls; nothing here knows about
 * request/response objects except where IP/user-agent are passed in as
 * plain values by the caller.
 */
class AuthService
{
    private UserModel $users;
    private RoleModel $roles;
    private RefreshTokenModel $refreshTokens;
    private JwtService $jwt;
    private AuditService $audit;
    private AuthConfig $config;

    public function __construct(
        ?UserModel $users = null,
        ?RoleModel $roles = null,
        ?RefreshTokenModel $refreshTokens = null,
        ?JwtService $jwt = null,
        ?AuditService $audit = null,
        ?AuthConfig $config = null
    ) {
        $this->users         = $users ?? new UserModel();
        $this->roles         = $roles ?? new RoleModel();
        $this->refreshTokens = $refreshTokens ?? new RefreshTokenModel();
        $this->jwt           = $jwt ?? new JwtService();
        $this->audit         = $audit ?? new AuditService();
        $this->config        = $config ?? config('Auth');
    }

    /**
     * Authenticates by email/password, applies lockout policy, and returns
     * an access token + opaque refresh token + user profile.
     *
     * @throws ApiException on bad credentials, locked account, or inactive user
     */
    public function login(string $email, string $password, string $ip, string $userAgent): array
    {
        $user = $this->users->findActiveByEmail($email);

        if (!$user) {
            // Same generic message as a wrong password — never reveal which part was wrong.
            throw ApiException::unauthorized('Invalid email or password.');
        }

        if (!empty($user['locked_until']) && $user['locked_until'] > date('Y-m-d H:i:s')) {
            throw new ApiException(
                'Account is temporarily locked due to repeated failed login attempts. Please try again later.',
                423
            );
        }

        if (!password_verify($password, $user['password_hash'])) {
            $this->registerFailedAttempt($user);
            throw ApiException::unauthorized('Invalid email or password.');
        }

        // Success: reset attempt counter, record login metadata.
        $this->users->update($user['id'], [
            'failed_login_attempts' => 0,
            'locked_until'          => null,
            'last_login_at'         => date('Y-m-d H:i:s'),
            'last_login_ip'         => $ip,
        ]);

        $userWithRole = $this->users->withRole($user['id']);
        $permissions  = $this->roles->permissionNames((int) $user['role_id']);

        $accessToken = $this->jwt->issueAccessToken([
            'sub'         => $user['id'],
            'role'        => $userWithRole['role_slug'],
            'branch_id'   => $user['branch_id'],
            'permissions' => $permissions,
        ]);

        $refreshToken = $this->issueRefreshToken((int) $user['id'], $ip, $userAgent);

        $this->audit->log((int) $user['id'], 'auth.login', 'auth', 'User logged in');

        return [
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type'    => 'Bearer',
            'expires_in'    => $this->jwt->accessTokenTtl(),
            'user'          => $this->sanitizeUser($userWithRole, $permissions),
        ];
    }

    public function logout(int $userId, ?string $rawRefreshToken): void
    {
        if ($rawRefreshToken) {
            $hash = $this->jwt->hashOpaqueToken($rawRefreshToken);
            $row  = $this->refreshTokens->findValidByHash($hash);
            if ($row && (int) $row['user_id'] === $userId) {
                $this->refreshTokens->revoke((int) $row['id']);
            }
        } else {
            // No specific token supplied — revoke every session for this user.
            $this->refreshTokens->revokeAllForUser($userId);
        }

        $this->audit->log($userId, 'auth.logout', 'auth', 'User logged out');
    }

    /**
     * Rotates a refresh token: the old one is revoked and a new pair is issued.
     * Rotation limits the blast radius if a refresh token is ever stolen.
     */
    public function refresh(string $rawRefreshToken, string $ip, string $userAgent): array
    {
        $hash = $this->jwt->hashOpaqueToken($rawRefreshToken);
        $row  = $this->refreshTokens->findValidByHash($hash);

        if (!$row) {
            throw ApiException::unauthorized('Refresh token is invalid or has expired.');
        }

        $user = $this->users->find($row['user_id']);
        if (!$user || !$user['is_active']) {
            throw ApiException::unauthorized('Account is no longer active.');
        }

        $this->refreshTokens->revoke((int) $row['id']);

        $userWithRole = $this->users->withRole($user['id']);
        $permissions  = $this->roles->permissionNames((int) $user['role_id']);

        $accessToken = $this->jwt->issueAccessToken([
            'sub'         => $user['id'],
            'role'        => $userWithRole['role_slug'],
            'branch_id'   => $user['branch_id'],
            'permissions' => $permissions,
        ]);

        $newRefresh = $this->issueRefreshToken((int) $user['id'], $ip, $userAgent);

        return [
            'access_token'  => $accessToken,
            'refresh_token' => $newRefresh,
            'token_type'    => 'Bearer',
            'expires_in'    => $this->jwt->accessTokenTtl(),
        ];
    }

    public function changePassword(int $userId, string $currentPassword, string $newPassword): void
    {
        $user = $this->users->find($userId);
        if (!$user) {
            throw ApiException::notFound('User not found.');
        }

        if (!password_verify($currentPassword, $user['password_hash'])) {
            throw ApiException::validation(['current_password' => 'Current password is incorrect.']);
        }

        $this->users->update($userId, [
            'password_hash' => password_hash($newPassword, PASSWORD_BCRYPT),
        ]);

        // Force re-login everywhere after a password change.
        $this->refreshTokens->revokeAllForUser($userId);

        $this->audit->log($userId, 'auth.password_change', 'auth', 'Password changed by user');
    }

    /**
     * Always returns void/no information about whether the email exists —
     * prevents user enumeration. The raw token is returned only so the
     * controller/caller can email it; it is never logged or stored raw.
     */
    public function forgotPassword(string $email): ?string
    {
        $user = $this->users->findActiveByEmail($email);
        if (!$user) {
            return null;
        }

        $rawToken = bin2hex(random_bytes(32));
        $this->users->update($user['id'], [
            'password_reset_token'   => hash('sha256', $rawToken),
            'password_reset_expires' => date('Y-m-d H:i:s', time() + 3600),
        ]);

        $this->audit->log((int) $user['id'], 'auth.forgot_password', 'auth', 'Password reset requested');

        return $rawToken;
    }

    public function resetPassword(string $rawToken, string $newPassword): void
    {
        $hash = hash('sha256', $rawToken);
        $user = $this->users->findByResetToken($hash);

        if (!$user) {
            throw ApiException::validation(['token' => 'Reset token is invalid or has expired.']);
        }

        $this->users->update($user['id'], [
            'password_hash'          => password_hash($newPassword, PASSWORD_BCRYPT),
            'password_reset_token'   => null,
            'password_reset_expires' => null,
        ]);

        $this->refreshTokens->revokeAllForUser((int) $user['id']);

        $this->audit->log((int) $user['id'], 'auth.password_reset', 'auth', 'Password reset via token');
    }

    /**
     * Used by RoleFilter to authorize a request against required permission(s).
     */
    public function userHasPermission(array $jwtClaims, string $permission): bool
    {
        $granted = $jwtClaims['permissions'] ?? [];
        return in_array($permission, (array) $granted, true);
    }

    // ---------------------------------------------------------------

    private function issueRefreshToken(int $userId, string $ip, string $userAgent): string
    {
        $raw  = $this->jwt->generateOpaqueToken();
        $hash = $this->jwt->hashOpaqueToken($raw);

        $this->refreshTokens->insert([
            'user_id'    => $userId,
            'token_hash' => $hash,
            'expires_at' => date('Y-m-d H:i:s', time() + $this->jwt->refreshTokenTtl()),
            'ip_address' => $ip,
            'user_agent' => substr($userAgent, 0, 255),
        ]);

        return $raw;
    }

    private function registerFailedAttempt(array $user): void
    {
        $attempts = (int) $user['failed_login_attempts'] + 1;
        $update   = ['failed_login_attempts' => $attempts];

        if ($attempts >= $this->config->maxLoginAttempts) {
            $update['locked_until']          = date('Y-m-d H:i:s', time() + $this->config->lockoutMinutes * 60);
            $update['failed_login_attempts'] = 0;
        }

        $this->users->update($user['id'], $update);
        $this->audit->log((int) $user['id'], 'auth.login_failed', 'auth', 'Failed login attempt');
    }

    private function sanitizeUser(array $user, array $permissions): array
    {
        unset($user['password_hash'], $user['password_reset_token'], $user['password_reset_expires']);
        $user['permissions'] = $permissions;
        return $user;
    }
}
