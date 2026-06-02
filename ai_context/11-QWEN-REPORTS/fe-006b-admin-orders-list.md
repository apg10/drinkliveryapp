# FE-006B — Admin Orders List Shell

## Summary

Added a minimal read-only admin orders list screen using the existing `getAdminOrders()` helper. Qwen timed out before making FE-006B edits, so the task was completed in Codex/OpenCode.

## Files Changed

- `frontend/src/components/AdminOrders.jsx` — new admin orders list component.
- `frontend/src/App.jsx` — added `AdminOrders` import, `admin-orders` view state branch, and a small dev/admin entry point.
- `frontend/src/styles.css` — added admin orders and dev/admin entry styles.
- `frontend/README.md` — documented FE-006B admin orders behavior and auth assumptions.
- `ai_context/02-LOG.md` — added FE-006B execution entry.
- `ai_context/11-QWEN-REPORTS/fe-006b-admin-orders-list.md` — this report.

## UX States

- Loading: shows `Loading admin orders...`.
- Error: shows readable backend error copy and a retry button.
- Auth required: 401/403 responses show `Admin access is required...` without adding frontend auth.
- Empty: shows `No orders yet.`.
- Populated: renders order cards.

## Displayed Fields

- `order_code`
- `status`
- `payment_status`
- `customer.full_name`
- `address.city`
- `total`
- `scheduled_date`
- `scheduled_time_window`
- `created_at`

## Explicit Confirmations

- No backend files were modified.
- No dependencies were added.
- No React Router was added.
- No login UI, token storage, or auth flow was added.
- No order detail view was added.
- No status update, payment update, delivery verification UI, product admin, charts, or external integrations were added.
- No document number, document image, ID upload, or other sensitive ID collection fields were added.

## Build Result

`npm run build` from `frontend/` passed. Vite transformed 32 modules and completed without errors.
