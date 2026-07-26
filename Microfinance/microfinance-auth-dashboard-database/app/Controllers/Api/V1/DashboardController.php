<?php

namespace App\Controllers\Api\V1;

use App\Services\DashboardService;

class DashboardController extends BaseApiController
{
    private DashboardService $dashboard;

    public function __construct()
    {
        $this->dashboard = new DashboardService();
    }

    /**
     * GET /api/v1/dashboard/summary
     * Non-admin roles are automatically scoped to their own branch;
     * admins see the whole organization unless ?branch_id= is supplied.
     */
    public function summary()
    {
        $branchId = $this->resolveBranchScope();
        return $this->success($this->dashboard->summary($branchId));
    }

    /**
     * GET /api/v1/dashboard/charts/collection-trend
     */
    public function collectionTrend()
    {
        $branchId = $this->resolveBranchScope();
        $days     = (int) ($this->request->getGet('days') ?? 14);

        return $this->success($this->dashboard->collectionTrend($branchId, $days));
    }

    /**
     * GET /api/v1/dashboard/charts/loan-status
     */
    public function loanStatusBreakdown()
    {
        $branchId = $this->resolveBranchScope();
        return $this->success($this->dashboard->loanStatusBreakdown($branchId));
    }

    private function resolveBranchScope(): ?int
    {
        $claims = $this->authUser();

        if (($claims['role'] ?? null) === 'admin') {
            $requested = $this->request->getGet('branch_id');
            return $requested !== null ? (int) $requested : null;
        }

        return $claims['branch_id'] !== null ? (int) $claims['branch_id'] : null;
    }
}
