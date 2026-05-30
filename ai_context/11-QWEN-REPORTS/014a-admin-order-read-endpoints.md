# BE-014A Admin Order Read Endpoints

## Status

Completed in Codex/OpenCode after Qwen/local AI stalled mid-task.

## Files Changed

- `backend/apps/orders/urls.py`
- `backend/apps/orders/views.py`
- `backend/apps/orders/tests/test_admin_order_endpoints.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/014a-admin-order-read-endpoints.md`

## Implementation

- Added `GET /api/admin/orders/`.
- Added `GET /api/admin/orders/{id}/`.
- Protected both endpoints with DRF `IsAdminUser`.
- Returned internal order data: id, order code, status, payment fields, customer summary, address summary, totals, schedule fields, item summaries, and creation timestamp.
- Kept status update, payment update, delivery verification, dashboard, product admin, frontend, and integrations out of scope.

## Tests

- Added admin order list/detail API tests.
- Covered unauthenticated rejection, non-admin rejection, admin list, admin detail, detail item data, list item summaries, scheduled fields, and unknown order 404.

## Commands Run

- `python -m pytest apps/orders -q`

## Result

- `50 passed`

## Notes

- No migrations required.
