<?php

namespace Config;

use App\Exceptions\ApiExceptionHandler;
use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Debug\ExceptionHandler;
use CodeIgniter\Debug\ExceptionHandlerInterface;

class Exceptions extends BaseConfig
{
    public array $ignoreCodes = [];

    public string $logLevelThreshold = 'error';

    public string $errorViewPath = APPPATH . 'Views/errors';

    public string $sensitiveDataInTrace = '';

    /**
     * Any request under /api/ gets the JSON envelope handler; everything
     * else (the Bootstrap admin frontend) falls back to CI4's default
     * HTML error handler.
     */
    public \Closure $handler = static function (int $statusCode, \Throwable $exception): ExceptionHandlerInterface {
        $request = service('request');

        if (str_starts_with(trim($request->getUri()->getPath(), '/'), 'api/')) {
            return new ApiExceptionHandler();
        }

        return new ExceptionHandler(config(Exceptions::class));
    };
}
