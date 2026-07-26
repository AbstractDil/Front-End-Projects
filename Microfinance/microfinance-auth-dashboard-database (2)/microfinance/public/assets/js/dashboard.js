function dashboardPage() {
  return {
    loading: true,
    user: null,
    summary: {
      today_collection: 0,
      today_disbursement: 0,
      active_loans: 0,
      closed_loans: 0,
      overdue_loans: 0,
      customer_count: 0,
    },
    charts: {},

    async init() {
      this.user = MFI.getUser();
      if (!this.user) {
        try {
          const { data } = await MFI.api.get('/auth/me');
          this.user = data.data;
        } catch (e) {
          return; // interceptor already redirects to /login on 401
        }
      }

      await Promise.all([this.loadSummary(), this.loadCharts()]);
      this.loading = false;
    },

    async loadSummary() {
      const { data } = await MFI.api.get('/dashboard/summary');
      this.summary = data.data;
    },

    async loadCharts() {
      const [trendRes, statusRes] = await Promise.all([
        MFI.api.get('/dashboard/charts/collection-trend'),
        MFI.api.get('/dashboard/charts/loan-status'),
      ]);

      const trend = trendRes.data.data;
      const statusBreakdown = statusRes.data.data;

      this.renderTrendChart(trend);
      this.renderStatusChart(statusBreakdown);
    },

    renderTrendChart(rows) {
      const ctx = document.getElementById('collectionTrendChart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: rows.map((r) => r.day),
          datasets: [{
            label: 'Daily Collection',
            data: rows.map((r) => Number(r.total)),
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13,110,253,0.1)',
            tension: 0.3,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    },

    renderStatusChart(rows) {
      const ctx = document.getElementById('loanStatusChart');
      if (!ctx) return;

      const colors = {
        active: '#198754', closed: '#6c757d', pending: '#ffc107',
        approved: '#0dcaf0', rejected: '#dc3545', written_off: '#212529',
      };

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: rows.map((r) => r.status),
          datasets: [{
            data: rows.map((r) => Number(r.total)),
            backgroundColor: rows.map((r) => colors[r.status] || '#adb5bd'),
          }],
        },
        options: { responsive: true },
      });
    },

    logout() {
      MFI.api.post('/auth/logout', { refresh_token: MFI.getRefreshToken() })
        .finally(() => {
          MFI.clearSession();
          window.location.href = '/login';
        });
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
    },
  };
}
