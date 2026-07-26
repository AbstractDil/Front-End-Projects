<?php

namespace Config;

use App\Validation\AuthRules;
use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Validation\CreditCardRules;
use CodeIgniter\Validation\FileRules;
use CodeIgniter\Validation\FormatRules;
use CodeIgniter\Validation\Rules;
use CodeIgniter\Validation\StrictRules\CreditCardRules as StrictCreditCardRules;
use CodeIgniter\Validation\StrictRules\FileRules as StrictFileRules;
use CodeIgniter\Validation\StrictRules\FormatRules as StrictFormatRules;
use CodeIgniter\Validation\StrictRules\Rules as StrictRules;

class Validation extends BaseConfig
{
    // Strict rules avoid PHP's loose type juggling — required for a financial app.
    public array $ruleSets = [
        StrictRules::class,
        StrictFormatRules::class,
        StrictFileRules::class,
        StrictCreditCardRules::class,
        AuthRules::class,
    ];

    public bool $CSRFProtection = false; // API is stateless/JWT; CSRF applies to the server-rendered admin views only, configured separately.

    public array $templates = [
        'list'   => 'CodeIgniter\Validation\Views\list',
        'single' => 'CodeIgniter\Validation\Views\single',
    ];

    // ---------------------------------------------------------------
    // Named rule groups reused across the Auth module's controllers.
    // ---------------------------------------------------------------

    public array $login = [
        'email'    => 'required|valid_email',
        'password' => 'required|min_length[8]',
    ];

    public array $login_errors = [
        'email' => [
            'required'    => 'Email address is required.',
            'valid_email' => 'Please provide a valid email address.',
        ],
        'password' => [
            'required'   => 'Password is required.',
            'min_length' => 'Password must be at least 8 characters.',
        ],
    ];

    public array $changePassword = [
        'current_password' => 'required',
        'new_password'     => 'required|strong_password|differs[current_password]',
        'confirm_password' => 'required|matches[new_password]',
    ];

    public array $forgotPassword = [
        'email' => 'required|valid_email',
    ];

    public array $resetPassword = [
        'token'            => 'required|min_length[20]',
        'new_password'     => 'required|strong_password',
        'confirm_password' => 'required|matches[new_password]',
    ];

    public array $refreshToken = [
        'refresh_token' => 'required|min_length[20]',
    ];
}
