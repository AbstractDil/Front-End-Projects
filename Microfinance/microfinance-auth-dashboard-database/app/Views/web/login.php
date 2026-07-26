<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sign In · Microfinance Management System</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
  <style>
    body { background: #f5f7fb; min-height: 100vh; display: flex; align-items: center; }
    .login-card { max-width: 400px; width: 100%; margin: auto; }
  </style>
</head>
<body>

  <div class="login-card">
    <div class="card shadow-sm border-0">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <i class="bi bi-bank2 fs-1 text-primary"></i>
          <h4 class="mt-2 mb-0">Microfinance MS</h4>
          <p class="text-muted small">Sign in to your account</p>
        </div>

        <div x-data="loginForm()">
          <div x-show="errorMessage" x-cloak class="alert alert-danger py-2 small" x-text="errorMessage"></div>

          <form @submit.prevent="submit">
            <div class="mb-3">
              <label class="form-label small text-muted">Email address</label>
              <input type="email" class="form-control" x-model="email"
                     :class="fieldErrors.email && 'is-invalid'" required autofocus>
              <div class="invalid-feedback" x-text="fieldErrors.email"></div>
            </div>

            <div class="mb-3">
              <label class="form-label small text-muted">Password</label>
              <input type="password" class="form-control" x-model="password"
                     :class="fieldErrors.password && 'is-invalid'" required>
              <div class="invalid-feedback" x-text="fieldErrors.password"></div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span x-show="loading" class="spinner-border spinner-border-sm me-1"></span>
              <span x-text="loading ? 'Signing in…' : 'Sign In'"></span>
            </button>
          </form>

          <div class="text-center mt-3">
            <a href="#" class="small text-muted">Forgot your password?</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/axios@1.7.7/dist/axios.min.js"></script>
  <script src="/assets/js/api-client.js"></script>
  <script src="/assets/js/login.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js"></script>
</body>
</html>
