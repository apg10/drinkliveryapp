# BE-014C Admin Payment Update

## Status

Completed.

## Files Changed

- `backend/apps/orders/urls.py`
- `backend/apps/orders/views.py`
- `backend/apps/orders/tests/test_admin_order_endpoints.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/014c-admin-payment-update.md`

## Implementation

- Added `PATCH /api/admin/orders/{id}/payment/`.
- Protected the endpoint with DRF `IsAdminUser`.
- Accepts `method`, `status`, `amount` (required), and optional `reference`, `notes`.
- Validates `method` against `Order.PaymentMethod` values.
- Validates `status` against `Order.PaymentStatus` values.
- Calls `record_manual_payment()` to create the payment record and update order payment_status.
- Response includes `id`, `order_code`, `payment_status`, `payment_record_id`.

## Tests

- Unauthenticated access rejected (403).
- Non-admin access rejected (403).
- Admin creates payment record with correct method, status, and amount.
- Order `payment_status` updates to the confirmed status.
- `reference` and `notes` are stored on the PaymentRecord.
- Invalid method returns 400.
- Invalid status returns 400.
- Invalid amount returns 400.
- Non-finite amount returns 400.
- Unknown order returns 404.

## Commands Run

- `python -m pytest apps/orders apps/payments apps/compliance -q`

## Result

- `122 passed`

## Notes

- No migrations required.
- Reuses `record_manual_payment()` from `apps/payments/services.py`.
