# BLOCK 5 - Admin Operations

## Block ID and Title

Block 5: Admin Operations — Order management, payment handling, delivery verification, and dashboard summary.

## Microtasks Completed

### BE-014A — Admin Order Read Endpoints
- Added `GET /api/admin/orders/` (list) and `GET /api/admin/orders/{id}/` (detail).
- Protected with DRF `IsAdminUser`.
- Response fields: id, order_code, status, payment fields, customer summary, address summary, totals, schedule fields, item summaries, created_at.
- Tests: 50 passed.

### BE-014B — Admin Order Status Update
- Added `PATCH /api/admin/orders/{id}/status/`.
- Accepts `status` and optional `note`.
- Validates status against `Order.Status` choices.
- Uses `transition_order_status()` to update order and create `OrderStatusHistory`.
- Stores `changed_by` from authenticated username (fallback to email).
- Tests: 56 passed.

### BE-014C — Admin Payment Update
- Added `PATCH /api/admin/orders/{id}/payment/`.
- Accepts `method`, `status`, `amount` (required), `reference` and `notes` (optional).
- Validates method against `Order.PaymentMethod`, status against `Order.PaymentStatus`.
- Calls `record_manual_payment()` from `apps/payments/services.py`.
- Returns order_id, order_code, payment_status, payment_record_id.
- Tests: 122 passed (including payments and compliance apps).

### BE-014D — Admin Delivery Verification
- Added `POST /api/admin/orders/{id}/delivery-verification/`.
- Accepts `receiver_name` (required), `receiver_document_checked` (bool, required), `receiver_is_adult` (bool, required), `verification_notes` (optional).
- Rejects `document_number` and `document_image` fields with 400.
- Calls `record_delivery_verification()` from `apps/compliance/services.py`.
- Successful verification → order transitions to DELIVERED.
- Failed verification → order transitions to FAILED_AGE_VERIFICATION + ComplianceEvent created.
- Tests: 122 passed (including payments and compliance apps).

### BE-015A — Admin Dashboard Summary
- Added `GET /api/admin/dashboard/summary/`.
- Returns: total_orders (int), pending_orders (int), orders_by_status (dict), confirmed_revenue (str).
- confirmed_revenue sums `Order.total` where payment_status == CONFIRMED.
- Tests: 122 passed (including payments and compliance apps).

## Files Changed by Task

### BE-014A
- `backend/apps/orders/urls.py` — added list and detail URL patterns
- `backend/apps/orders/views.py` — added admin_order_list, admin_order_detail views
- `backend/apps/orders/tests/test_admin_order_endpoints.py` — added list/detail test cases
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/014a-admin-order-read-endpoints.md`

### BE-014B
- `backend/apps/orders/urls.py` — added status update URL
- `backend/apps/orders/views.py` — added admin_order_status_update view
- `backend/apps/orders/tests/test_admin_order_endpoints.py` — added status update test cases
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/014b-admin-order-status-update.md`

### BE-014C
- `backend/apps/orders/urls.py` — added payment update URL
- `backend/apps/orders/views.py` — added admin_order_payment_update view
- `backend/apps/orders/tests/test_admin_order_endpoints.py` — added payment update test cases
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/014c-admin-payment-update.md`

### BE-014D
- `backend/apps/orders/urls.py` — added delivery-verification URL
- `backend/apps/orders/views.py` — added admin_delivery_verification view
- `backend/apps/orders/tests/test_admin_order_endpoints.py` — added delivery verification test cases
- `ai_context/11-QWEN-REPORTS/014d-admin-delivery-verification.md`
- `ai_context/02-LOG.md`

### BE-015A
- `backend/apps/orders/urls.py` — added dashboard summary URL
- `backend/apps/orders/views.py` — added admin_dashboard_summary view
- `backend/apps/orders/tests/test_admin_order_endpoints.py` — added dashboard summary test cases
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/015a-admin-dashboard-summary.md`

## Tests Run

| Microtask | Command Run | Result |
|-----------|-------------|--------|
| BE-014A | `python -m pytest apps/orders -q` | 56 passed (full suite) |
| BE-014B | `python -m pytest apps/orders -q` | 56 passed |
| BE-014C | `python -m pytest apps/orders apps/payments apps/compliance -q` | 122 passed |
| BE-014D | `python -m pytest apps/orders apps/payments apps/compliance -q` | 122 passed |
| BE-015A | `python -m pytest apps/orders apps/payments apps/compliance -q` | 122 passed |
| **Full suite** | `python -m pytest -q` | **185 passed** |
| Django check | `python manage.py check` | **OK** |
| Migrations check | `python manage.py makemigrations --dry-run --check` | **No changes detected** |

## Overall Result

Block 5 completed successfully. All 5 microtasks (BE-014A through BE-015A) were implemented and tested. The full test suite with 185 tests passes. Django system check reports OK. No new migrations required. All endpoints enforce `IsAdminUser` permission.

## Deviations or Fixes Applied

- `transition_order_status` service created by BE-010 became the shared dependency for all status-patch operations, reducing duplication across BE-014B and BE-014D.
- Split BE-009 into BE-009A/BE-009B during Block 3 (terms vs age) — same reduction strategy applied here to keep each admin task narrow.
- Block 5 review hardening: admin payment endpoint rejects invalid and non-finite amounts; delivery verification endpoint rejects non-boolean verification flags.
- All tasks reuse existing service functions (`transition_order_status`, `record_manual_payment`, `record_delivery_verification`) rather than duplicating logic directly in views.

## Risks or Unresolved Questions

- **confirmed_revenue type**: Return value is a `str` (Decimal serialization). Frontend should handle string-to-decimal conversion or the endpoint could return a float/int later if a standard format is decided.
- **Order list pagination**: The `GET /api/admin/orders/` list endpoint returns all orders without pagination. For large datasets this could be a performance issue. Pagination should be added if admin needs to handle 10k+ orders.
- **Dashboard cache**: The dashboard summary executes live database queries on every request. Adding caching (Redis or Django cache framework) would be advisable for production.
- **No audit log**: Status and payment changes store `changed_by` as a string (username or email). If audit traceability is required, consider storing the user FK link for future sessions/auth backends.
- **Full name not used in verified_by**: Following the delivery verification spec, `verified_by` uses username or email (not the user's full name). If admin reports need display names, a mapping or serialization update will be needed.

## Ready for Codex/OpenCode Review

Yes. All microtasks implemented, tested, and documented. Full test suite passes (185/185). Django check OK. No migration changes. All reports written. Ready for review.
