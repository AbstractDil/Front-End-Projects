<?php

namespace App\Exceptions;

use CodeIgniter\Debug\ExceptionHandlerInterface;
use Psr\Log\LogLevel;
use Throwable;

/**
 * Registered as Config\Exceptions::$handler for the api/* routes (see
 * Config\Exceptions). Converts ANY throwable — ApiException, CI4
 * validation/database exceptions, or a raw PHP error — into the project's
 * standard JSON envelope, so no controller has to remember to catch
 * exceptions individually. Full details are always logged server-side;
 * only safe messages ever reach the client in production.
 */
class ApiExceptionHandler implements ExceptionHandlerInterface
{
    public function handle(
        Throwable $exception,
        \CodeIgniter\HTTP\RequestInterface $request,
        \CodeIgniter\HTTP\ResponseInterface $response,
        int $statusCode,
        int $exitCode
    ): void {
        log_message(LogLevel::ERROR, '{exception}', ['exception' => $exception]);

        $isApiException = $exception instanceof ApiException;
        $httpStatus     = $isApiException ? $exception->getStatusCode() : ($statusCode >= 400 ? $statusCode : 500);

        $inProduction = ENVIRONMENT === 'production';

        $payload = [
            'status'  => false,
            'message' => $isApiException || !$inProduction
                ? $exception->getMessage()
                : 'An unexpected error occurred. Please try again later.',
        ];

        if ($isApiException && $exception->getErrors() !== []) {
            $payload['errors'] = $exception->getErrors();
        }

        if (!$inProduction && !$isApiException) {
            $payload['debug'] = [
                'exception' => get_class($exception),
                'file'      => $exception->getFile(),
                'line'      => $exception->getLine(),
            ];
        }

        $response
            ->setStatusCode($httpStatus)
            ->setJSON($payload)
            ->send();
    }
}
