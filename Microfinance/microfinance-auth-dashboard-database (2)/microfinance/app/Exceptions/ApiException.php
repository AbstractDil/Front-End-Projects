<?php

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Thrown by Services when a business rule is violated (bad credentials,
 * locked account, insufficient permission, etc). Controllers never need to
 * catch this themselves — App\Exceptions\ApiExceptionHandler converts it
 * into the standard JSON error envelope centrally.
 */
class ApiException extends RuntimeException
{
    private int $statusCode;
    private array $errors;

    public function __construct(string $message, int $statusCode = 400, array $errors = [], ?Throwable $previous = null)
    {
        parent::__construct($message, 0, $previous);
        $this->statusCode = $statusCode;
        $this->errors      = $errors;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public static function unauthorized(string $message = 'Unauthorized'): self
    {
        return new self($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden'): self
    {
        return new self($message, 403);
    }

    public static function notFound(string $message = 'Resource not found'): self
    {
        return new self($message, 404);
    }

    public static function validation(array $errors, string $message = 'Validation failed'): self
    {
        return new self($message, 422, $errors);
    }

    public static function tooManyRequests(string $message = 'Too many requests'): self
    {
        return new self($message, 429);
    }
}
