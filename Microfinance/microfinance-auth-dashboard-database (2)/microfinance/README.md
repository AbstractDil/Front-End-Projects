# Microfinance Management System

API-first Microfinance Management System built on **CodeIgniter 4** (PHP 8.3+), with a **Bootstrap 5 + Alpine.js + Axios + Chart.js** frontend consuming a JSON REST API secured by **JWT**.

This delivery implements the first three modules end-to-end: **Database foundation**, **Authentication**, and **Dashboard**. Remaining modules (Customer Management, Loan Products, Loan Management, Collections, Reports, Expenses, User & Role management UI, Settings) follow the exact same layered pattern and slot into `app/Config/Routes.php` as their own route groups.

## Project layout

This archive contains only the **application layer** (`app/`) and **public assets** — it is meant to sit on top of the standard CodeIgniter 4 skeleton (`codeigniter4/appstarter`), which provides the framework core, `public/index.php` bootstrap, `spark` CLI, and default `vendor/`.

```
app/
  Config/          Auth, Validation, Exceptions, Filters, Routes (project-specific)
  Controllers/
    Api/V1/        AuthController, DashboardController, BaseApiController
    Web/           LoginController, DashboardController (serve the HTML shell)
  Database/
    Migrations/    branches, roles, permissions+pivot, users+refresh_tokens, audit_logs, core stubs
    Seeders/       RolePermissionSeeder, UserSeeder, DatabaseSeeder
  Exceptions/       ApiException, ApiExceptionHandler (centralized JSON error handling)
  Filters/          JwtAuthFilter, RoleFilter (permission checks), RateLimitFilter
  Models/           UserModel, RoleModel, PermissionModel, BranchModel, AuditLogModel, RefreshTokenModel
  Services/         AuthService, JwtService, DashboardService, AuditService
  Validation/        AuthRules (strong_password custom rule)
  Views/web/         login.php, dashboard.php
public/assets/js/    api-client.js (Axios + auto-refresh), login.js, dashboard.js
docs/                API documentation + testing checklist for these 3 modules
```

## Setup

1. Scaffold the base framework (if you don't already have it):
   ```bash
   composer create-project codeigniter4/appstarter mfi-app
   ```
2. Copy this `app/` and `public/assets/` into that project (merging with the existing skeleton — this delivery does not include `public/index.php`, `spark`, or `vendor/`).
3. Install the two extra dependencies used here:
   ```bash
   composer require firebase/php-jwt:^6.10
   ```
4. Copy `env` to `.env` in the project root and fill in real values — **especially `JWT_SECRET_KEY`** (generate with `php -r "echo bin2hex(random_bytes(32));"`) and your database credentials.
5. Create the database, then run:
   ```bash
   php spark migrate
   php spark db:seed DatabaseSeeder
   ```
6. Start the dev server:
   ```bash
   php spark serve
   ```
7. Visit `http://localhost:8080/login` and sign in with the seeded admin:
   - **Email:** `admin@mfi.local`
   - **Password:** `ChangeMe@123` — change this immediately via `/auth/change-password`.

## What's implemented

| Layer | Auth | Dashboard | Database |
|---|---|---|---|
| Migration | `users`, `refresh_tokens`, `roles`, `permissions`+pivot | (reuses `loans`, `loan_collections`, `customers` stubs) | `branches`, `audit_logs`, core stub tables |
| Model | `UserModel`, `RoleModel`, `RefreshTokenModel` | — (query-builder based, see `DashboardService`) | `BranchModel`, `PermissionModel`, `AuditLogModel` |
| Validation | `Config\Validation` rule groups + `AuthRules::strong_password` | n/a (read-only, query params only) | — |
| Service | `AuthService`, `JwtService`, `AuditService` | `DashboardService` | — |
| Controller | `AuthController` | `DashboardController` | — |
| Routes | `api/v1/auth/*` | `api/v1/dashboard/*` | — |
| Docs | `docs/API_AUTH_DASHBOARD.md` | same file | same file |
| Frontend | `/login` (Bootstrap/Alpine/Axios) | `/dashboard` (cards + Chart.js) | — |
| Testing checklist | `docs/TESTING_CHECKLIST_AUTH_DASHBOARD.md` | same file | same file |

## Key architectural decisions

- **Thin controllers, fat services.** Every controller method is ~5–10 lines: validate input, call one service method, return `success()`/`fail()`. All business rules (lockout policy, token rotation, permission checks) live in `app/Services`.
- **JWT access + opaque refresh tokens.** Access tokens are short-lived (15 min default) stateless JWTs carrying `role`, `branch_id`, and a flattened `permissions` array so authorization checks never need a DB round-trip mid-request. Refresh tokens are long-lived, opaque, stored only as a SHA-256 hash, and rotated on every use — a stolen refresh token can be revoked and a reused one is immediately detectable.
- **Centralized exception handling.** `App\Exceptions\ApiExceptionHandler` (wired via `Config\Exceptions::$handler`) converts every throwable on `api/*` routes into the standard JSON envelope, so no individual controller needs a try/catch.
- **Permission model, not just roles.** Routes declare fine-grained permissions (`customers.create`) rather than hardcoding role names, so adding a fifth role later doesn't require touching route definitions.
- **Dashboard degrades gracefully.** `overdue_loans` checks for `loan_schedules` before querying it, so the Dashboard module works standalone today and picks up real overdue data automatically once the Loan Management module adds that table — no code change needed there.
- **Audit logging as its own service.** `AuditService::log()` is the single call site for every audit entry across the whole app, keeping the `audit_logs` schema and IP/user-agent capture consistent as more modules call it.

## Next module

Following the same **migration → model → validation → service → controller → routes → docs → frontend → axios → testing checklist** sequence, **Customer Management** is the natural next module (it's a dependency of Loan Management and Collections).
