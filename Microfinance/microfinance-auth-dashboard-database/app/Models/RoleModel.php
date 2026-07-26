<?php

namespace App\Models;

use CodeIgniter\Model;

class RoleModel extends Model
{
    protected $table            = 'roles';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = ['name', 'slug', 'description', 'is_system'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'name' => 'required|min_length[2]|max_length[50]',
        'slug' => 'required|alpha_dash|max_length[50]|is_unique[roles.slug,id,{id}]',
    ];

    /**
     * All permission names granted to a role — cached per-request by the
     * caller (AuthService) to avoid repeated joins on every authorized call.
     */
    public function permissionNames(int $roleId): array
    {
        $rows = $this->db->table('role_permissions rp')
            ->select('p.name')
            ->join('permissions p', 'p.id = rp.permission_id')
            ->where('rp.role_id', $roleId)
            ->get()
            ->getResultArray();

        return array_column($rows, 'name');
    }
}
