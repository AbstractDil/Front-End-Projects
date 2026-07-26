# API Documentation — Authentication & Dashboard Modules

Base URL: `/api/v1`
All responses use the standard envelope:

```json
{ "status": true, "message": "Success", "data": {} }
```
```json
{ "status": false, "message": "Validation failed", "errors": {} }
```

Authenticated endpoints require `Authorization: Bearer <access_token>`.

---

## Authentication

### POST `/auth/login`
Public. Rate-limited (10 req/min/IP).

**Body**
```json
{ "email": "admin@mfi.local", "password": "ChangeMe@123" }
```

**200 OK**
```json
{
  "status": true,
  "message": "Login successful.",
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "9f2c...",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": 1, "full_name": "System Administrator", "email": "admin@mfi.local",
      "role_slug": "admin", "branch_id": 1, "permissions": ["customers.view", "..."]
    }
  }
}
```

**Errors**: `401` invalid credentials, `423` account locked (too many failed attempts), `422` validation, `429` rate-limited.

---

### POST `/auth/refresh`
Public — the refresh token itself is the credential. Rotates the token (old one is revoked).

**Body** `{ "refresh_token": "9f2c..." }`
**200 OK** → same shape as login minus `user`.
**401** if expired/revoked/invalid.

---

### POST `/auth/logout`
Authenticated.

**Body** (optional) `{ "refresh_token": "9f2c..." }` — omit to revoke *all* sessions for the user.
**200 OK** `{ "status": true, "message": "Logged out successfully." }`

---

### POST `/auth/change-password`
Authenticated.

**Body**
```json
{ "current_password": "old", "new_password": "NewPass1!", "confirm_password": "NewPass1!" }
```
Revokes all existing refresh tokens on success (forces re-login on other devices).

---

### POST `/auth/forgot-password`
Public. Always returns a generic success message (prevents account enumeration). In non-production environments only, `data.reset_token` is included for testing until email delivery is wired up.

**Body** `{ "email": "admin@mfi.local" }`

---

### POST `/auth/reset-password`
Public.

**Body**
```json
{ "token": "<raw token from forgot-password>", "new_password": "NewPass1!", "confirm_password": "NewPass1!" }
```

---

### GET `/auth/me`
Authenticated. Returns the decoded JWT claims (id, role, branch, permissions) — used by the frontend to hydrate state after a page reload.

---

## Dashboard

All dashboard routes require `dashboard.view` permission (granted to every seeded role). Non-admin users are automatically scoped to their own `branch_id`; admins may pass `?branch_id=` to filter, or omit it for an org-wide view.

### GET `/dashboard/summary`
```json
{
  "data": {
    "today_collection": 125000,
    "today_disbursement": 300000,
    "active_loans": 214,
    "closed_loans": 87,
    "overdue_loans": 12,
    "customer_count": 340
  }
}
```

### GET `/dashboard/charts/collection-trend?days=14`
```json
{ "data": [ { "day": "2026-06-27", "total": "45000" }, "..." ] }
```

### GET `/dashboard/charts/loan-status`
```json
{ "data": [ { "status": "active", "total": 214 }, { "status": "closed", "total": 87 } ] }
```

> Note: `overdue_loans` returns `0` until the Loan Management module (which introduces `loan_schedules`) is implemented — the query detects the missing table and degrades gracefully rather than erroring.

---

## Role & Permission Model

| Role           | Notes                                                             |
|----------------|--------------------------------------------------------------------|
| `admin`        | Full access to every permission, bypasses all `permission:` filter checks |
| `manager`      | View/create/update on all modules; delete only on `expenses`      |
| `cashier`      | Full access to `collections`; read-only on `customers`, `loans`, `reports`, `dashboard` |
| `field_officer`| View/create/update on `customers` and `loans`; view on `dashboard` |

Permissions follow the `{module}.{action}` naming convention (e.g. `customers.create`). Routes declare the required permission inline: `['filter' => 'permission:customers.create']`.
