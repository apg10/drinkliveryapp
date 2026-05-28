# BLOCK-2: Catalog And Delivery Surface

## 1. Block ID And Title

`BLOCK-2`: Catalog And Delivery Surface

## 2. Microtasks Completed

- `BE-003`: Add product catalog models
- `BE-004`: Add public catalog endpoint
- `BE-005`: Add public product detail endpoint
- `BE-006`: Add delivery zones

Reports:

- `ai_context/11-QWEN-REPORTS/003-product-catalog-models.md`
- `ai_context/11-QWEN-REPORTS/004-public-catalog-endpoint.md`
- `ai_context/11-QWEN-REPORTS/005-public-product-detail.md`
- `ai_context/11-QWEN-REPORTS/006-delivery-zones.md`

## 3. Files Changed By Task

### BE-003

- `backend/config/settings.py`
- `backend/apps/products/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/003-product-catalog-models.md`

### BE-004

- `backend/config/urls.py`
- `backend/apps/products/serializers.py`
- `backend/apps/products/urls.py`
- `backend/apps/products/views.py`
- `backend/apps/products/tests/test_catalog.py`
- `backend/apps/products/tests/test_models.py`
- `backend/apps/products/models.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/004-public-catalog-endpoint.md`

### BE-005

- `backend/apps/products/urls.py`
- `backend/apps/products/views.py`
- `backend/apps/products/tests/test_product_detail.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/005-public-product-detail.md`

### BE-006

- `backend/config/settings.py`
- `backend/config/urls.py`
- `backend/apps/delivery/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/006-delivery-zones.md`

## 4. Tests Run By Task

### BE-003

- Product model tests.
- Category, Product, ProductVariant creation and ordering tests.
- Tenant-scoped slug uniqueness tests.

### BE-004

- Public catalog endpoint tests.
- Active/inactive filtering tests.
- Tenant isolation tests.
- Unknown tenant 404 tests.

### BE-005

- Public product detail endpoint tests.
- Active-only product tests.
- Inactive product/category tests.
- Tenant isolation tests.
- Active variant filtering tests.

### BE-006

- Delivery zone model tests.
- Public delivery zones endpoint tests.
- Active/inactive zone tests.
- Tenant isolation tests.
- Unknown/inactive tenant 404 tests.

## 5. Overall Test Result

Final verification run by Codex/OpenCode:

```text
python -m pytest -> 63 passed
python manage.py check -> System check identified no issues
python manage.py makemigrations --check --dry-run -> No changes detected
```

## 6. Deviations From Allowed Scope

- `BE-004` corrected BE-003 model/test issues because catalog endpoint tests exposed them.
- No frontend code was added.
- No order, payment, compliance, notification, Docker, Celery, Redis, Stripe, or WhatsApp API code was added.
- No Git commit or push was performed by local AI.

## 7. Risks Or Unresolved Questions

- Catalog and product detail views currently build JSON manually. This is acceptable for the current small API surface but can be revisited later if serializer-based nested output becomes cleaner.
- Public responses expose `is_active` on categories/variants. This is not sensitive, but it is redundant because only active records are returned.

## 8. Ready For Codex/OpenCode Review

Yes.
