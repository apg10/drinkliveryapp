# BE-007: Orders Foundation

## Task ID

BE-007

## Summary

Created the `apps.orders` Django app foundation with customer, address, order, order item, and order status history models.

The implementation includes initial order statuses, manual payment method/status choices, unique public order code generation, admin registrations, migrations, and model tests.

## Files Changed

Created:

- `backend/apps/orders/__init__.py`
- `backend/apps/orders/apps.py`
- `backend/apps/orders/admin.py`
- `backend/apps/orders/models.py`
- `backend/apps/orders/migrations/__init__.py`
- `backend/apps/orders/migrations/0001_initial.py`
- `backend/apps/orders/tests/__init__.py`
- `backend/apps/orders/tests/test_models.py`
- `ai_context/11-QWEN-REPORTS/007-orders-foundation.md`

Modified:

- `backend/config/settings.py`
- `ai_context/02-LOG.md`

## Tests Added Or Updated

Added model tests for:

- Customer creation.
- Customer string representation.
- Address creation.
- Address string representation.
- Order creation with default `PENDING` status.
- Payment status defaulting to `PENDING`.
- Unique order code generation.
- Order string representation.
- Order item total calculation from product base price.
- Order item total calculation from variant price.
- Order item string representation.
- Order status history creation.
- Order status history string representation.

## Test Command Run

```text
python -m pytest apps/orders -q
```

## Test Result

```text
13 passed
```

## Notes Or Risks

- `OrderStatusHistory.changed_by` is stored as a text field for now. A later admin/auth milestone can replace or supplement this with a user foreign key if needed.
- `OrderItem.save()` calculates `unit_price` and `total_price` for model-level behavior. Checkout services in BE-008 should still validate product/variant ownership and active state before creating items.
- No checkout endpoint was created in this task.
- No payment app, compliance app, notification app, admin API, or frontend code was created.

## Ready For Codex/OpenCode Review

Yes.
