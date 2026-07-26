<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id'                     => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'branch_id'              => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
            'role_id'                => ['type' => 'INT', 'unsigned' => true],
            'employee_code'          => ['type' => 'VARCHAR', 'constraint' => 30, 'null' => true],
            'full_name'              => ['type' => 'VARCHAR', 'constraint' => 150],
            'email'                  => ['type' => 'VARCHAR', 'constraint' => 150],
            'phone'                  => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'password_hash'          => ['type' => 'VARCHAR', 'constraint' => 255],
            'is_active'              => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'failed_login_attempts'  => ['type' => 'INT', 'unsigned' => true, 'default' => 0],
            'locked_until'           => ['type' => 'DATETIME', 'null' => true],
            'last_login_at'          => ['type' => 'DATETIME', 'null' => true],
            'last_login_ip'          => ['type' => 'VARCHAR', 'constraint' => 45, 'null' => true],
            'password_reset_token'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'password_reset_expires' => ['type' => 'DATETIME', 'null' => true],
            'created_at'             => ['type' => 'DATETIME', 'null' => true],
            'updated_at'             => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'             => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('email');
        $this->forge->addForeignKey('role_id', 'roles', 'id', 'RESTRICT', 'CASCADE');
        $this->forge->addForeignKey('branch_id', 'branches', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('users');

        // Refresh tokens (rotatable, revocable) — supports the optional refresh-token flow
        $this->forge->addField([
            'id'         => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'user_id'    => ['type' => 'BIGINT', 'unsigned' => true],
            'token_hash' => ['type' => 'VARCHAR', 'constraint' => 255], // SHA-256 hash of the raw token, never store raw
            'expires_at' => ['type' => 'DATETIME'],
            'revoked_at' => ['type' => 'DATETIME', 'null' => true],
            'ip_address' => ['type' => 'VARCHAR', 'constraint' => 45, 'null' => true],
            'user_agent' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('token_hash');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('refresh_tokens');
    }

    public function down(): void
    {
        $this->forge->dropTable('refresh_tokens', true);
        $this->forge->dropTable('users', true);
    }
}
