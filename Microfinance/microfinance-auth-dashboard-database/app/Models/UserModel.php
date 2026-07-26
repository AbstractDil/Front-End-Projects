<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;

    protected $allowedFields = [
        'branch_id', 'role_id', 'employee_code', 'full_name', 'email', 'phone',
        'password_hash', 'is_active', 'failed_login_attempts', 'locked_until',
        'last_login_at', 'last_login_ip', 'password_reset_token', 'password_reset_expires',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    protected $validationRules = [
        'branch_id'     => 'permit_empty|is_natural_no_zero',
        'role_id'       => 'required|is_natural_no_zero',
        'full_name'     => 'required|min_length[2]|max_length[150]',
        'email'         => 'required|valid_email|max_length[150]',
        'phone'         => 'permit_empty|max_length[20]',
        'password_hash' => 'required',
    ];

    protected $validationMessages = [
        'email' => [
            'is_unique' => 'This email address is already registered.',
        ],
    ];

    /**
     * Find an active, non-locked user by email — used by AuthService::login().
     */
    public function findActiveByEmail(string $email): ?array
    {
        return $this->where('email', $email)
            ->where('is_active', 1)
            ->first();
    }

    public function findByResetToken(string $tokenHash): ?array
    {
        return $this->where('password_reset_token', $tokenHash)
            ->where('password_reset_expires >=', date('Y-m-d H:i:s'))
            ->first();
    }

    /**
     * User row enriched with role name/slug — used for JWT claims and the UI.
     */
    public function withRole(int $userId): ?array
    {
        return $this->select('users.*, roles.name as role_name, roles.slug as role_slug')
            ->join('roles', 'roles.id = users.role_id')
            ->where('users.id', $userId)
            ->first();
    }
}
