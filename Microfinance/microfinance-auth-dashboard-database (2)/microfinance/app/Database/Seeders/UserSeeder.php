<?php

namespace App\Database\Seeders;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = date('Y-m-d H:i:s');

        $branchId = $this->db->table('branches')->insert([
            'name'       => 'Head Office',
            'code'       => 'HO001',
            'is_active'  => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ], true) ? $this->db->insertID() : null;

        $adminRole = $this->db->table('roles')->select('id')->where('slug', 'admin')->get()->getRow();

        // NOTE: change this password immediately after first login in any
        // non-development environment. Seeded only for local bootstrap.
        $this->db->table('users')->insert([
            'branch_id'     => $branchId,
            'role_id'       => $adminRole->id,
            'employee_code' => 'EMP0001',
            'full_name'     => 'System Administrator',
            'email'         => 'admin@mfi.local',
            'phone'         => null,
            'password_hash' => password_hash('ChangeMe@123', PASSWORD_BCRYPT),
            'is_active'     => 1,
            'created_at'    => $now,
            'updated_at'    => $now,
        ]);
    }
}
