<?php

namespace App\Database\Seeders;

use CodeIgniter\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Modules covered by the permission matrix. Each gets the standard
     * CRUD-style actions; modules can add bespoke actions as needed
     * (e.g. loans.approve, loans.disburse) when those modules are built.
     */
    protected array $modules = [
        'customers', 'loans', 'loan_products', 'collections',
        'expenses', 'reports', 'users', 'settings', 'dashboard',
    ];

    protected array $actions = ['view', 'create', 'update', 'delete'];

    public function run(): void
    {
        $now = date('Y-m-d H:i:s');

        // --- Roles -------------------------------------------------
        $roles = [
            ['name' => 'Admin',         'slug' => 'admin',         'description' => 'Full system access', 'is_system' => 1],
            ['name' => 'Manager',       'slug' => 'manager',       'description' => 'Branch-level oversight', 'is_system' => 1],
            ['name' => 'Cashier',       'slug' => 'cashier',       'description' => 'Collections & receipts', 'is_system' => 1],
            ['name' => 'Field Officer', 'slug' => 'field_officer', 'description' => 'Customer & loan field operations', 'is_system' => 1],
        ];
        foreach ($roles as &$role) {
            $role['created_at'] = $now;
            $role['updated_at'] = $now;
        }
        unset($role);
        $this->db->table('roles')->insertBatch($roles);

        // --- Permissions --------------------------------------------
        $permissions = [];
        foreach ($this->modules as $module) {
            foreach ($this->actions as $action) {
                $permissions[] = [
                    'name'        => "{$module}.{$action}",
                    'module'      => $module,
                    'description' => ucfirst($action) . ' ' . str_replace('_', ' ', $module),
                    'created_at'  => $now,
                ];
            }
        }
        $this->db->table('permissions')->insertBatch($permissions);

        // --- Role -> Permission mapping -------------------------------
        $roleIds = $this->db->table('roles')->select('id, slug')->get()->getResultArray();
        $roleIds = array_column($roleIds, 'id', 'slug');

        $permIds = $this->db->table('permissions')->select('id, name')->get()->getResultArray();
        $permIds = array_column($permIds, 'id', 'name');

        $map = [];

        // Admin: everything
        foreach ($permIds as $pid) {
            $map[] = ['role_id' => $roleIds['admin'], 'permission_id' => $pid];
        }

        // Manager: view/create/update everywhere, no deletes except expenses
        foreach ($permIds as $name => $pid) {
            if (str_ends_with($name, '.delete') && $name !== 'expenses.delete') {
                continue;
            }
            $map[] = ['role_id' => $roleIds['manager'], 'permission_id' => $pid];
        }

        // Cashier: collections + read-only customers/loans/reports
        $cashierAllowed = [
            'collections.view', 'collections.create', 'collections.update',
            'customers.view', 'loans.view', 'reports.view', 'dashboard.view',
        ];
        foreach ($cashierAllowed as $name) {
            if (isset($permIds[$name])) {
                $map[] = ['role_id' => $roleIds['cashier'], 'permission_id' => $permIds[$name]];
            }
        }

        // Field Officer: customers + loans (no delete), dashboard view
        foreach ($permIds as $name => $pid) {
            if ((str_starts_with($name, 'customers.') || str_starts_with($name, 'loans.'))
                && !str_ends_with($name, '.delete')) {
                $map[] = ['role_id' => $roleIds['field_officer'], 'permission_id' => $pid];
            }
        }
        if (isset($permIds['dashboard.view'])) {
            $map[] = ['role_id' => $roleIds['field_officer'], 'permission_id' => $permIds['dashboard.view']];
        }

        $this->db->table('role_permissions')->insertBatch($map);
    }
}
