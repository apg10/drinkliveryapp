# BE-011A: Public Order Status Endpoint

## Task ID

BE-011A

## Summary

Added `GET /api/public/{tenant_slug}/orders/{order_code}/status/` endpoint that returns only safe public fields for order tracking. Tenant isolation is enforced at both the tenant lookup and order lookup levels. No customer data, payment references, admin notes, or internal fields are exposed.

## Files Changed

- `backend/apps/orders/views.py` — added `public_order_status` view
- `backend/apps/orders/urls.py` — added URL route for the status endpoint (before checkout route to avoid path conflicts)
- `backend/apps/orders/tests/test_public_order_status.py` — new test file with 5 API tests
- `ai_context/02-LOG.md` — added log entry for BE-011A

## Tests Added

File: `backend/apps/orders/tests/test_public_order_status.py`

1. `test_active_order_status_returns_200` — verifies 200 response with all 5 safe fields: `order_code`, `status`, `scheduled_date`, `scheduled_time_window`, `total`.
2. `test_unknown_tenant_returns_404` — verifies 404 when tenant slug does not exist or is inactive.
3. `test_unknown_order_returns_404` — verifies 404 when order_code does not exist.
4. `test_order_from_another_tenant_returns_404` — verifies tenant isolation; an order belonging to a different tenant returns 404 under this tenant's slug.
5. `test_response_contains_safe_fields_only` — verifies the response keys match exactly the safe set, and that `customer`, `address`, `payment_method`, `items`, and `customer_notes` are not present.

## Test Command Run

```
cd backend
python -m pytest apps/orders -q
```

## Test Result

All 39 orders tests passing (34 existing + 5 new).

Full suite: 102 tests passing.

## Notes / Risks

- URL order matters: the status route (`orders/<str:order_code>/status/`) is placed before the checkout route (`orders/`) to prevent Django's URL resolver from matching an order_code as "orders".
- Tenant lookup checks `is_active=True`, so inactive tenants also return 404.
- The `Order` import is at the top level to avoid circular imports (it was already used in `views.py` via `Order.Status.PENDING` in `services.py`).
- No serializer used for this endpoint per the original spec (Response Draft in 14-ENDPOINT-MATRIX uses `JsonResponse`).
- Ready for Codex/OpenCode review.
