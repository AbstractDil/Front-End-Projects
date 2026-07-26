<?php

namespace App\Services;

use Config\Auth as AuthConfig;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use UnexpectedValueException;

/**
 * Thin wrapper around firebase/php-jwt. Knows nothing about users or the
 * database — it only encodes/decodes claims. AuthService decides what goes
 * into those claims.
 */
class JwtService
{
    private AuthConfig $config;

    public function __construct(?AuthConfig $config = null)
    {
        $this->config = $config ?? config('Auth');
    }

    /**
     * @param array $claims Custom claims, e.g. ['sub' => $userId, 'role' => 'admin']
     */
    public function issueAccessToken(array $claims): string
    {
        $now = time();

        $payload = array_merge($claims, [
            'iss' => $this->config->issuer,
            'iat' => $now,
            'nbf' => $now,
            'exp' => $now + $this->config->accessTokenTtl,
            'type' => 'access',
        ]);

        return JWT::encode($payload, $this->config->jwtSecret, $this->config->jwtAlgo);
    }

    /**
     * Decodes and validates a JWT. Returns the claims as an array, or throws
     * on any failure (expired, bad signature, malformed). Callers should
     * catch and translate to a 401 JSON response.
     *
     * @throws ExpiredException|SignatureInvalidException|UnexpectedValueException
     */
    public function decode(string $token): array
    {
        $decoded = JWT::decode($token, new Key($this->config->jwtSecret, $this->config->jwtAlgo));
        return (array) $decoded;
    }

    public function accessTokenTtl(): int
    {
        return $this->config->accessTokenTtl;
    }

    public function refreshTokenTtl(): int
    {
        return $this->config->refreshTokenTtl;
    }

    /**
     * Generates a cryptographically secure opaque refresh token (not a JWT —
     * stored server-side as a hash so it can be revoked/rotated).
     */
    public function generateOpaqueToken(): string
    {
        return bin2hex(random_bytes(40));
    }

    public function hashOpaqueToken(string $rawToken): string
    {
        return hash('sha256', $rawToken);
    }
}
