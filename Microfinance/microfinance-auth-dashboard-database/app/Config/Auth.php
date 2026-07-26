<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Auth extends BaseConfig
{
    public string $jwtSecret;
    public string $jwtAlgo;
    public int $accessTokenTtl;   // seconds
    public int $refreshTokenTtl;  // seconds
    public string $issuer;

    public int $maxLoginAttempts;
    public int $lockoutMinutes;

    public function __construct()
    {
        parent::__construct();

        $this->jwtSecret        = (string) env('JWT_SECRET_KEY', '');
        $this->jwtAlgo          = (string) env('JWT_ALGO', 'HS256');
        $this->accessTokenTtl   = (int) env('JWT_ACCESS_TTL_SECS', 900);
        $this->refreshTokenTtl  = (int) env('JWT_REFRESH_TTL_SECS', 1209600);
        $this->issuer           = (string) env('JWT_ISSUER', 'mfi-api');

        $this->maxLoginAttempts = (int) env('AUTH_MAX_LOGIN_ATTEMPTS', 5);
        $this->lockoutMinutes   = (int) env('AUTH_LOCKOUT_MINUTES', 15);

        if ($this->jwtSecret === '' && ENVIRONMENT === 'production') {
            throw new \RuntimeException('JWT_SECRET_KEY must be set in production.');
        }
    }
}
