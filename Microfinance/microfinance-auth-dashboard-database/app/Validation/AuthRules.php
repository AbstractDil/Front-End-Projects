<?php

namespace App\Validation;

/**
 * Custom, reusable validation rules registered in Config\Validation::$ruleSets.
 * Business validation (e.g. "email must belong to an active user") stays out
 * of here and lives in the relevant Service instead — these rules only check
 * the shape of the input, never the database business state.
 */
class AuthRules
{
    /**
     * Enforces a minimum-strength password: 8+ chars, at least one letter,
     * one number, and one special character.
     */
    public function strong_password(string $str, ?string &$error = null): bool
    {
        if (strlen($str) < 8) {
            $error = 'Password must be at least 8 characters long.';
            return false;
        }
        if (!preg_match('/[A-Za-z]/', $str) || !preg_match('/\d/', $str)) {
            $error = 'Password must contain both letters and numbers.';
            return false;
        }
        if (!preg_match('/[^A-Za-z0-9]/', $str)) {
            $error = 'Password must contain at least one special character.';
            return false;
        }
        return true;
    }
}
