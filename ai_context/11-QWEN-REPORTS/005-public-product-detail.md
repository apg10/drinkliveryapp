# BE-005: Public Product Detail Endpoint

## Task ID

BE-005

## Summary

Added a public product detail endpoint at `GET /api/public/{tenant_slug}/products/{product_slug}/` that returns a single active product with its active variants, enforcing that the product, its category, and the tenant are all active.

## Files Changed

### Modified
- `backend/apps/products/views.py` — Added `public_product_detail` view
- `backend/apps/products/urls.py` — Added product detail URL route

### Created
- `backend/apps/products/tests/test_product_detail.py` — 10 API tests for the product detail endpoint

## Tests Added

10 tests in `backend/apps/products/tests/test_product_detail.py`:

1. `test_active_product_detail_returns_200` — Active product returns 200 with correct data
2. `test_inactive_product_returns_404` — Inactive product returns 404
3. `test_product_under_inactive_category_returns_404` — Product under inactive category returns 404
4. `test_product_from_another_tenant_returns_404` — Tenant isolation enforced
5. `test_inactive_variant_is_excluded` — Inactive variants excluded from response
6. `test_unknown_product_returns_404` — Nonexistent product returns 404
7. `test_unknown_tenant_returns_404` — Nonexistent tenant returns 404
8. `test_inactive_tenant_returns_404` — Inactive tenant returns 404
9. `test_product_detail_includes_active_variants_only` — Only active variants returned
10. `test_product_detail_has_required_fields` — All expected fields present in response

## Test Command Run

`cd backend && python -m pytest apps/products/tests`

## Test Result

30 tests collected, 30 passed, 0 failed (0.65s).

All existing tests continue to pass. No regressions.

## Notes

- Uses `select_related('category')` to avoid N+1 queries on the category lookup.
- Returns the same product fields as the catalog endpoint for consistency.
- Does not expose admin-only fields; only public-facing fields are included.
- URL route ordering is correct: the product detail route is added after the catalog route to avoid conflicts.

## Ready for Review

Yes
