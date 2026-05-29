# BE-012B: Manual Payment Service

## Task ID

BE-012B

## Summary

Added a small manual payment service for creating `PaymentRecord` rows and updating the related order's `payment_status`.

No payment gateway, payment API endpoint, admin API, frontend code, or external payment integration was added.

## Files Changed

- `backend/apps/payments/services.py`
- `backend/apps/payments/tests/test_services.py`
- `backend/apps/payments/apps.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/012b-manual-payment-service.md`

## Tests Added Or Updated

Added service tests covering:

- Manual payment service creates a `PaymentRecord`.
- Manual payment service updates `order.payment_status`.
- Reference and notes are stored.
- `confirmed_at` is auto-set for confirmed payments when missing.
- `confirmed_at` is not auto-set for failed payments.
- Payment records, references, and notes are not exposed by the public order status endpoint.

## Test Command Run

```text
python -m pytest apps/payments apps/orders -q
python -m pytest
python manage.py check
python manage.py makemigrations --check --dry-run
```

## Test Result

```text
python -m pytest apps/payments apps/orders -q -> 55 passed
python -m pytest -> 118 passed
python manage.py check -> System check identified no issues
python manage.py makemigrations --check --dry-run -> No changes detected
```

## Notes Or Risks

- The service updates only `Order.payment_status`, not `Order.payment_method`.
- `confirmed_at` is automatically set only when status is `CONFIRMED` and no timestamp is supplied.
- External payment gateways remain out of scope.

## Ready For Codex/OpenCode Review

Yes.
