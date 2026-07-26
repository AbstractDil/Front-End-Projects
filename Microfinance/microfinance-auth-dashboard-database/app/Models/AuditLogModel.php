<?php

namespace App\Models;

use CodeIgniter\Model;

class AuditLogModel extends Model
{
    protected $table            = 'audit_logs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    // Audit logs are append-only: no updates, no deletes, no soft-delete field.
    protected $allowedFields = [
        'user_id', 'action', 'module', 'description', 'ip_address', 'user_agent', 'meta',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = false;

    protected $casts = [
        'meta' => 'json',
    ];
}
