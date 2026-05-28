# BE-004 Completion Report: Public Catalog Endpoint

## Task ID
BE-004

## Summary
Implemented the public catalog endpoint at `GET /api/public/{tenant_slug}/catalog/`. Returns active categories, products, and variants for a given tenant slug, with proper tenant isolation.

## Files Changed

### New files
- `backend/apps/products/serializers.py` - Serializers for ProductVariant, Product, Category, and Catalog
- `backend/apps/products/urls.py` - URL route for public catalog endpoint
- `backend/apps/products/tests/test_catalog.py` - 8 API tests covering all BE-004 requirements

### Modified files
- `backend/apps/products/views.py` - Implemented `public_catalog` view with manual serialization to avoid nested prefetch issues
- `backend/apps/products/models.py` - Fixed pre-existing validation import issue and added tenant-scoped slug uniqueness cleanup after review
- `backend/apps/products/tests/test_models.py` - Fixed pre-existing bugs: added missing model imports (`Category`, `Product`, `ProductVariant`), added missing `ValidationError` import, fixed `test_product_str` missing `base_price`, fixed `test_product_tenant_must_match_category_tenant` using wrong exception class
- `backend/config/urls.py` - Added products URL wiring

## Tests Added

- `test_catalog_returns_200_for_active_tenant` - Endpoint returns 200 for active tenant
- `test_catalog_excludes_inactive_categories` - Inactive categories filtered out
- `test_catalog_excludes_inactive_products` - Inactive products filtered out
- `test_catalog_excludes_inactive_variants` - Inactive variants filtered out
- `test_tenant_isolation_products_not_shared` - Products from other tenants excluded
- `test_unknown_tenant_returns_404` - Unknown slug returns 404
- `test_inactive_tenant_returns_404` - Inactive tenant returns 404
- `test_catalog_orders_by_display_order` - Categories ordered by display_order

## Test Command Run
```
pytest apps/products/tests/ -v
```

## Test Result
20 passed in 0.38s
- 8 new catalog API tests (BE-004)
- 12 existing model tests (BE-003 pre-existing, fixed import bugs)

## Notes or Risks
- Used manual serialization (dict building) instead of DRF serializer for nested data to avoid Django's nested prefetch limitation (Category -> Products -> Variants is invalid)
- Fixed pre-existing issues in `test_models.py` and `models.py` that prevented reliable model/API testing. Follow-up review also aligned category/product slug uniqueness with tenant isolation.

## Readiness for Review
Yes, ready for Codex/OpenCode review.
