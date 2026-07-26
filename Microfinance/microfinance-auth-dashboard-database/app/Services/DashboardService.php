<?php

namespace App\Services;

use CodeIgniter\Database\BaseConnection;
use Config\Database;

/**
 * Read-only aggregation queries for the dashboard. Deliberately uses the
 * query builder directly (rather than routing through several models)
 * since these are cross-table reporting queries, not entity CRUD.
 */
class DashboardService
{
    private BaseConnection $db;

    public function __construct(?BaseConnection $db = null)
    {
        $this->db = $db ?? Database::connect();
    }

    /**
     * @param int|null $branchId Restrict to one branch (non-admin roles), or null for all branches.
     */
    public function summary(?int $branchId = null): array
    {
        $today = date('Y-m-d');

        return [
            'today_collection'   => $this->todayCollection($branchId, $today),
            'today_disbursement' => $this->todayDisbursement($branchId, $today),
            'active_loans'       => $this->loanCountByStatus($branchId, 'active'),
            'closed_loans'       => $this->loanCountByStatus($branchId, 'closed'),
            'overdue_loans'      => $this->overdueLoanCount($branchId, $today),
            'customer_count'     => $this->customerCount($branchId),
        ];
    }

    /**
     * Collection totals for the last 14 days, for the dashboard line chart.
     */
    public function collectionTrend(?int $branchId = null, int $days = 14): array
    {
        $builder = $this->db->table('loan_collections')
            ->select('DATE(collected_at) as day, SUM(amount) as total')
            ->where('collected_at >=', date('Y-m-d 00:00:00', strtotime("-{$days} days")))
            ->groupBy('DATE(collected_at)')
            ->orderBy('day', 'ASC');

        if ($branchId !== null) {
            $builder->where('branch_id', $branchId);
        }

        return $builder->get()->getResultArray();
    }

    /**
     * Loan status breakdown, for the dashboard pie/donut chart.
     */
    public function loanStatusBreakdown(?int $branchId = null): array
    {
        $builder = $this->db->table('loans')
            ->select('status, COUNT(*) as total')
            ->where('deleted_at', null)
            ->groupBy('status');

        if ($branchId !== null) {
            $builder->where('branch_id', $branchId);
        }

        return $builder->get()->getResultArray();
    }

    // ---------------------------------------------------------------

    private function todayCollection(?int $branchId, string $today): float
    {
        $builder = $this->db->table('loan_collections')
            ->selectSum('amount')
            ->where('DATE(collected_at)', $today);

        if ($branchId !== null) {
            $builder->where('branch_id', $branchId);
        }

        return (float) ($builder->get()->getRow()->amount ?? 0);
    }

    private function todayDisbursement(?int $branchId, string $today): float
    {
        $builder = $this->db->table('loans')
            ->selectSum('principal_amount')
            ->where('DATE(disbursed_at)', $today)
            ->where('deleted_at', null);

        if ($branchId !== null) {
            $builder->where('branch_id', $branchId);
        }

        return (float) ($builder->get()->getRow()->principal_amount ?? 0);
    }

    private function loanCountByStatus(?int $branchId, string $status): int
    {
        $builder = $this->db->table('loans')
            ->where('status', $status)
            ->where('deleted_at', null);

        if ($branchId !== null) {
            $builder->where('branch_id', $branchId);
        }

        return $builder->countAllResults();
    }

    /**
     * A loan is "overdue" if it is active and has an unpaid schedule line
     * whose due date has passed. loan_schedules is introduced by the Loan
     * Management module; until then this degrades gracefully to 0 rather
     * than erroring, so the dashboard works standalone.
     */
    private function overdueLoanCount(?int $branchId, string $today): int
    {
        if (!$this->db->tableExists('loan_schedules')) {
            return 0;
        }

        $builder = $this->db->table('loans l')
            ->join('loan_schedules ls', 'ls.loan_id = l.id')
            ->where('l.status', 'active')
            ->where('l.deleted_at', null)
            ->where('ls.due_date <', $today)
            ->where('ls.is_paid', 0)
            ->distinct()
            ->select('l.id');

        if ($branchId !== null) {
            $builder->where('l.branch_id', $branchId);
        }

        return $builder->countAllResults();
    }

    private function customerCount(?int $branchId): int
    {
        $builder = $this->db->table('customers')
            ->where('deleted_at', null)
            ->where('is_active', 1);

        if ($branchId !== null) {
            $builder->where('branch_id', $branchId);
        }

        return $builder->countAllResults();
    }
}
