# FE-006A — Admin API Helpers

## Task ID

FE-006A

## Summary

Added frontend API helpers for existing admin read endpoints. No admin UI, auth flow, or mutation endpoints were added.

## Files Changed

- `frontend/src/api.js` — Added `getAdminOrders()`, `getAdminOrder(id)`, `getAdminDashboardSummary()`
- `frontend/README.md` — Documented new admin helpers; noted they assume backend admin authentication already exists
- `ai_context/02-LOG.md` — Added FE-006A execution entry

## Helper Behavior

- `getAdminOrders()` calls `GET /admin/orders/` through existing `apiGet`.
- `getAdminOrder(id)` calls `GET /admin/orders/{id}/` through existing `apiGet`.
- `getAdminDashboardSummary()` calls `GET /admin/dashboard/summary/` through existing `apiGet`.
- All three use the existing `apiGet` error behavior: parsed backend error details with HTTP status on non-2xx responses.
- Existing public helpers (`getPublicCatalog`, `getPublicProduct`, `getPublicDeliveryZones`, `createPublicOrder`, `getPublicOrderStatus`) remain unchanged and functional.

## Explicit Confirmations

- No admin UI was added.
- No login UI, token storage, or auth flows were added.
- No mutation endpoints (status update, payment update, delivery verification) were added.
- No product admin, charts, or external integrations were added.
- No document number, document image, ID upload, or sensitive ID collection fields were added.
- No dependencies were added.
- No React Router was added.
- No backend files were modified.

## Build Result

`npm run build` from `frontend/` passed successfully in 564ms. All 31 modules transformed, 0 errors.

## Tests Added or Updated

N/A — API helpers only; no tests required for this microtask.

## Ready for Codex/OpenCode Review

Yes
