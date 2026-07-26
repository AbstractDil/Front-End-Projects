<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard · Microfinance Management System</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
  <style>
    body { background: #f5f7fb; }
    .stat-card .icon { width: 48px; height: 48px; border-radius: .75rem; display:flex; align-items:center; justify-content:center; }
  </style>
</head>
<body x-data="dashboardPage()" x-init="init()">

  <nav class="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm">
    <div class="container-fluid">
      <span class="navbar-brand fw-semibold"><i class="bi bi-bank2 text-primary"></i> Microfinance MS</span>
      <div class="ms-auto d-flex align-items-center gap-3">
        <span class="text-muted small" x-text="user ? user.role : ''"></span>
        <button class="btn btn-sm btn-outline-secondary" @click="logout()">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </div>
  </nav>

  <div class="container-fluid p-4">

    <div x-show="loading" x-cloak class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div x-show="!loading" x-cloak>
      <h5 class="mb-3">Dashboard</h5>

      <div class="row g-3 mb-4">
        <div class="col-6 col-md-4 col-xl-2">
          <div class="card stat-card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="icon bg-success-subtle text-success mb-2"><i class="bi bi-cash-coin fs-5"></i></div>
              <div class="small text-muted">Today's Collection</div>
              <div class="fs-5 fw-semibold" x-text="formatCurrency(summary.today_collection)"></div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="card stat-card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="icon bg-primary-subtle text-primary mb-2"><i class="bi bi-send-check fs-5"></i></div>
              <div class="small text-muted">Today's Disbursement</div>
              <div class="fs-5 fw-semibold" x-text="formatCurrency(summary.today_disbursement)"></div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="card stat-card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="icon bg-info-subtle text-info mb-2"><i class="bi bi-briefcase fs-5"></i></div>
              <div class="small text-muted">Active Loans</div>
              <div class="fs-5 fw-semibold" x-text="summary.active_loans"></div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="card stat-card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="icon bg-secondary-subtle text-secondary mb-2"><i class="bi bi-check2-circle fs-5"></i></div>
              <div class="small text-muted">Closed Loans</div>
              <div class="fs-5 fw-semibold" x-text="summary.closed_loans"></div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="card stat-card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="icon bg-danger-subtle text-danger mb-2"><i class="bi bi-exclamation-triangle fs-5"></i></div>
              <div class="small text-muted">Overdue Loans</div>
              <div class="fs-5 fw-semibold" x-text="summary.overdue_loans"></div>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-4 col-xl-2">
          <div class="card stat-card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="icon bg-warning-subtle text-warning mb-2"><i class="bi bi-people fs-5"></i></div>
              <div class="small text-muted">Customers</div>
              <div class="fs-5 fw-semibold" x-text="summary.customer_count"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="card-title mb-3">Collection Trend (Last 14 Days)</h6>
              <canvas id="collectionTrendChart" height="110"></canvas>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <h6 class="card-title mb-3">Loan Status Breakdown</h6>
              <canvas id="loanStatusChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/axios@1.7.7/dist/axios.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>
  <script src="/assets/js/api-client.js"></script>
  <script src="/assets/js/dashboard.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
</body>
</html>
