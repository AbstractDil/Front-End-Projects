<?php

namespace App\Models;

use CodeIgniter\Model;

class RefreshTokenModel extends Model
{
    protected $table            = 'refresh_tokens';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = [
        'user_id', 'token_hash', 'expires_at', 'revoked_at', 'ip_address', 'user_agent',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = false;

    public function findValidByHash(string $tokenHash): ?array
    {
        return $this->where('token_hash', $tokenHash)
            ->where('revoked_at', null)
            ->where('expires_at >=', date('Y-m-d H:i:s'))
            ->first();
    }

    public function revoke(int $id): bool
    {
        return (bool) $this->update($id, ['revoked_at' => date('Y-m-d H:i:s')]);
    }

    public function revokeAllForUser(int $userId): bool
    {
        return $this->where('user_id', $userId)
            ->where('revoked_at', null)
            ->set(['revoked_at' => date('Y-m-d H:i:s')])
            ->update();
    }
}
