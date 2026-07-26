<?php

namespace App\Models;

use CodeIgniter\Model;

class PermissionModel extends Model
{
    protected $table            = 'permissions';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    protected $allowedFields = ['name', 'module', 'description'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = false; // permissions are effectively immutable once seeded

    protected $validationRules = [
        'name'   => 'required|max_length[100]|is_unique[permissions.name,id,{id}]',
        'module' => 'required|max_length[50]',
    ];
}
