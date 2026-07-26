<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Minimal stub tables required so the Dashboard module has real data to
 * aggregate. Full column sets (KYC, guarantor, nominee, interest config,
 * penalty rules, etc.) are added by dedicated migrations when the
 * Customer Management and Loan Management modules are implemented.
 */
class CreateCoreStubTables extends Migration
{
    public function up(): void
    {
        // customers (stub)
        $this->forge->addField([
            'id'            => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'branch_id'     => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
            'customer_code' => ['type' => 'VARCHAR', 'constraint' => 30],
            'full_name'     => ['type' => 'VARCHAR', 'constraint' => 150],
            'phone'         => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'is_active'     => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at'    => ['type' => 'DATETIME', 'null' => true],
            'updated_at'    => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'    => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('customer_code');
        $this->forge->addForeignKey('branch_id', 'branches', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('customers');

        // loans (stub)
        $this->forge->addField([
            'id'              => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'branch_id'       => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
            'customer_id'     => ['type' => 'BIGINT', 'unsigned' => true],
            'loan_number'     => ['type' => 'VARCHAR', 'constraint' => 30],
            'principal_amount'=> ['type' => 'DECIMAL', 'constraint' => '18,2'],
            'outstanding_amount' => ['type' => 'DECIMAL', 'constraint' => '18,2', 'default' => 0],
            'status'          => ['type' => 'ENUM', 'constraint' => ['pending', 'approved', 'active', 'closed', 'rejected', 'written_off'], 'default' => 'pending'],
            'disbursed_at'    => ['type' => 'DATETIME', 'null' => true],
            'closed_at'       => ['type' => 'DATETIME', 'null' => true],
            'created_at'      => ['type' => 'DATETIME', 'null' => true],
            'updated_at'      => ['type' => 'DATETIME', 'null' => true],
            'deleted_at'      => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('loan_number');
        $this->forge->addKey('status');
        $this->forge->addForeignKey('customer_id', 'customers', 'id', 'RESTRICT', 'CASCADE');
        $this->forge->addForeignKey('branch_id', 'branches', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('loans');

        // loan_collections (stub) — one row per collection event
        $this->forge->addField([
            'id'             => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'loan_id'        => ['type' => 'BIGINT', 'unsigned' => true],
            'branch_id'      => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
            'collected_by'   => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
            'amount'         => ['type' => 'DECIMAL', 'constraint' => '18,2'],
            'collection_type'=> ['type' => 'ENUM', 'constraint' => ['emi', 'partial', 'advance', 'penalty'], 'default' => 'emi'],
            'collected_at'   => ['type' => 'DATETIME'],
            'created_at'     => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('collected_at');
        $this->forge->addForeignKey('loan_id', 'loans', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('branch_id', 'branches', 'id', 'SET NULL', 'CASCADE');
        $this->forge->addForeignKey('collected_by', 'users', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('loan_collections');
    }

    public function down(): void
    {
        $this->forge->dropTable('loan_collections', true);
        $this->forge->dropTable('loans', true);
        $this->forge->dropTable('customers', true);
    }
}
