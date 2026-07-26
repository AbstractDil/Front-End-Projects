# Testing Checklist — Database, Authentication & Dashboard Modules

## Database
- [ ] `php spark migrate` runs cleanly on an empty database, no FK errors, correct table order
- [ ] `php spark migrate:rollback` reverses cleanly (drop order respects FKs)
- [ ] `php spark db:seed DatabaseSeeder` creates 4 roles, full permission matrix, 1 branch, 1 admin user
- [ ] Unique constraints enforced: `users.email`, `roles.slug`, `permissions.name`, `branches.code`, `loans.loan_number`, `customers.customer_code`
- [ ] Soft-deleted rows (`users`, `branches`, `customers`, `loans`) are excluded from default model queries but recoverable
- [ ] `audit_logs` has no update/delete path exposed anywhere in code (append-only)

## Authentication
### Login
- [ ] Correct credentials → 200, access + refresh token, sanitized user object (no `password_hash` field present)
- [ ] Wrong password → 401, generic "Invalid email or password" (does not reveal user exists)
- [ ] Unknown email → 401, identical generic message
- [ ] Inactive user (`is_active = 0`) → 401
- [ ] 5 consecutive failed attempts → account locked (`423`) for `AUTH_LOCKOUT_MINUTES`
- [ ] Successful login resets `failed_login_attempts` to 0 and clears `locked_until`
- [ ] `last_login_at` / `last_login_ip` updated on success
- [ ] Missing/invalid email format or short password → 422 with field-level errors
- [ ] 11th login request within 60s from same IP → 429 rate limited

### Token lifecycle
- [ ] Access token expires after `JWT_ACCESS_TTL_SECS` and protected routes then return 401
- [ ] `/auth/refresh` with a valid refresh token issues a new access+refresh pair
- [ ] Old refresh token is revoked after use (replay attempt → 401)
- [ ] Expired/revoked/garbage refresh token → 401
- [ ] Frontend Axios interceptor: an expired access token triggers a silent refresh + retry with no user-visible error
- [ ] `/auth/logout` with a specific `refresh_token` revokes only that session; others remain valid
- [ ] `/auth/logout` with no body revokes **all** sessions for that user

### Password management
- [ ] `/auth/change-password` rejects wrong `current_password` (422)
- [ ] Weak new password (no digits/no special char/<8 chars) rejected by `strong_password` rule
- [ ] `new_password` same as `current_password` rejected (`differs` rule)
- [ ] Successful change revokes all refresh tokens (other devices are logged out)
- [ ] `/auth/forgot-password` returns identical success message whether or not the email exists
- [ ] Reset token expires after 1 hour and is single-use (cleared after successful reset)
- [ ] `/auth/reset-password` with expired/invalid token → 422

### Authorization
- [ ] Protected `api/v1/*` route without `Authorization` header → 401
- [ ] Malformed header (no `Bearer ` prefix) → 401
- [ ] Valid token but wrong `permission:` on route → 403 with the specific permission name in the message
- [ ] `admin` role bypasses all `permission:` checks
- [ ] `cashier` role denied on `customers.delete`-gated routes but allowed on `collections.create`
- [ ] JWT tampering (modified payload/signature) → 401 (`SignatureInvalidException` caught)

### Centralized exception handling
- [ ] Any uncaught exception on an `api/*` route returns the JSON envelope, never an HTML error page
- [ ] In `production` env, internal exception messages are masked; `ApiException` messages (safe, user-facing) still pass through
- [ ] Full exception + stack trace is written to the log on every 5xx

## Dashboard
- [ ] `/dashboard/summary` requires `dashboard.view`; returns 403 without it
- [ ] Non-admin user's results are automatically scoped to their own `branch_id` (verify by comparing two branches' data)
- [ ] Admin without `?branch_id=` sees org-wide totals; with it, sees only that branch
- [ ] `today_collection` / `today_disbursement` reflect only rows dated today (verify with seeded test data across multiple days)
- [ ] `active_loans` + `closed_loans` counts match manual `COUNT(*)` queries against `loans`
- [ ] `overdue_loans` returns `0` gracefully when `loan_schedules` table does not yet exist (pre–Loan Management module)
- [ ] `/dashboard/charts/collection-trend?days=7` returns exactly the date range requested, zero-filled or omitted for days with no collections (confirm expected behavior with product owner)
- [ ] `/dashboard/charts/loan-status` totals sum to the same figure as `active_loans + closed_loans + pending + ...`
- [ ] Dashboard page (Bootstrap/Alpine/Chart.js) renders cards and both charts correctly on first load and after a hard refresh (session persisted via localStorage)
- [ ] Logout button clears local session and redirects to `/login`; subsequent back-navigation to `/dashboard` redirects to login (no stale UI with real data)

## Security regression
- [ ] SQL injection payloads in `email`/`password` fields are safely parameterized (query builder, not raw concatenation)
- [ ] XSS payloads in any text field render escaped in the Bootstrap views (`esc()` / Alpine's default text binding, not `x-html`)
- [ ] `.env` is git-ignored; `JWT_SECRET_KEY` is never returned in any API response, log, or error message
