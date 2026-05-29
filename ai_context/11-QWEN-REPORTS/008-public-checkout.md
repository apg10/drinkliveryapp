# BE-008: Public Checkout Endpoint

## Task ID

BE-008

## Summary

Completed the public checkout endpoint at `POST /api/public/{tenant_slug}/orders/`.

The endpoint accepts customer, address, delivery zone, schedule, payment method, notes, and cart items. It validates active tenant, active delivery zone, active products, valid variants, tenant isolation, and non-empty cart. It creates customer, address, order, and order items with calculated subtotal, delivery fee, and total.

## Files Changed

Created:

- `backend/apps/orders/serializers.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/urls.py`
- `backend/apps/orders/views.py`
- `backend/apps/orders/tests/test_checkout_api.py`
- `ai_context/11-QWEN-REPORTS/008-public-checkout.md`

Modified:

- `backend/config/urls.py`
- `ai_context/02-LOG.md`

## Tests Added Or Updated

Added checkout API tests for:

- Successful checkout creates customer, address, order, and order item.
- Subtotal, delivery fee, and total calculation.
- Variant price usage.
- Empty cart rejection.
- Inactive product rejection.
- Product tenant isolation.
- Invalid variant rejection.
- Delivery zone tenant isolation.
- Inactive delivery zone rejection.
- Unknown tenant returns 404.

## Test Command Run

```text
python -m pytest apps/orders -q
```

## Test Result

```text
23 passed
```

## Notes Or Risks

- BE-008 stores `age_confirmed_by_customer` and `terms_accepted` when supplied, but does not enforce those rules. Enforcement is split into smaller follow-up tasks to avoid oversized local AI context.
- No payment gateway, payment app, compliance app, notification app, admin API, WhatsApp API, or frontend code was added.
- Checkout currently creates a new customer record per checkout. Customer reuse can be considered later if there is a concrete need.

## Ready For Codex/OpenCode Review

Yes.
