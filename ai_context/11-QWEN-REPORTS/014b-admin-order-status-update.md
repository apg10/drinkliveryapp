# BE-014B Admin Order Status Update

## Status

Completed in Codex/OpenCode review pass after Qwen/local AI left the task partial.

## Files Changed

- `backend/apps/orders/urls.py`
- `backend/apps/orders/views.py`
- `backend/apps/orders/tests/test_admin_order_endpoints.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/014b-admin-order-status-update.md`

## Implementation

- Added `PATCH /api/admin/orders/{id}/status/`.
- Protected the endpoint with DRF `IsAdminUser`.
- Accepts `status` and optional `note`.
- Validates status against `Order.Status` values.
- Uses `transition_order_status()` to update the order and create history.
- Stores `changed_by` from the authenticated username, falling back to email.

## Tests

- Unauthenticated access rejected.
- Non-admin access rejected.
- Admin can update status.
- Status update creates `OrderStatusHistory` with previous/new status, note, and changed_by.
- Invalid status returns 400.
- Unknown order returns 404.

## Commands Run

- `python -m pytest apps/orders -q`

## Result

- `56 passed`

## Notes

- No migrations required.
