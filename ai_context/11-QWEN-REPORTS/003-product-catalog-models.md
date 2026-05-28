# BE-003: Product Catalog Models

## Task ID

BE-003

## Summary

Created the `apps.products` Django app with tenant-scoped catalog models: `Category`, `Product`, and `ProductVariant`.

The implementation supports active/inactive filtering, display ordering, tenant isolation, admin management, and per-tenant slug uniqueness for categories and products.

## Files Changed

Created:

- `backend/apps/products/__init__.py`
- `backend/apps/products/apps.py`
- `backend/apps/products/admin.py`
- `backend/apps/products/models.py`
- `backend/apps/products/migrations/__init__.py`
- `backend/apps/products/migrations/0001_initial.py`
- `backend/apps/products/tests/__init__.py`
- `backend/apps/products/tests/test_models.py`

Modified:

- `backend/config/settings.py`
- `ai_context/02-LOG.md`

## Tests Added Or Updated

Model tests cover:

- Category creation.
- Category string representation.
- Category slug uniqueness per tenant.
- Category slug reuse across tenants.
- Product creation.
- Product string representation.
- Product tenant/category mismatch validation.
- Product inactive flag.
- Product slug uniqueness per tenant.
- Product slug reuse across tenants.
- ProductVariant creation.
- ProductVariant string representation.
- ProductVariant inactive flag.
- Display ordering for categories, products, and variants.

## Test Command Run

```text
python -m pytest apps/products/tests/test_models.py
```

## Test Result

Passing as part of the full backend suite.

## Notes Or Risks

- Category and Product slugs are unique per tenant, not globally unique, to preserve multi-market readiness.
- `Product.clean()` validates that product tenant and category tenant match.
- `ProductVariant` does not need tenant validation because it is scoped through its product.

## Ready For Codex/OpenCode Review

Yes.
