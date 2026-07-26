<?php

namespace App\Libraries;

/**
 * Holds the decoded JWT claims for the duration of the current request.
 * Set once by JwtAuthFilter::before(), read by RoleFilter and
 * BaseApiController::authUser(). Using a static holder instead of a dynamic
 * property on the Request object keeps this PHP 8.3-clean (dynamic
 * properties on non-#[AllowDynamicProperties] classes are deprecated) and
 * is safe here because CI4 boots a fresh process per HTTP request — there
 * is no cross-request state leakage.
 */
class AuthContext
{
    private static ?array $claims = null;

    public static function set(array $claims): void
    {
        self::$claims = $claims;
    }

    public static function get(): ?array
    {
        return self::$claims;
    }

    public static function clear(): void
    {
        self::$claims = null;
    }
}
