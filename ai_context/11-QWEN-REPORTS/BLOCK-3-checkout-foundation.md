# Block 3: Checkout Foundation

## Block ID and Title

**Block 3: Checkout Foundation**

Microtasks: `BE-007`, `BE-008`, `BE-009A`, `BE-009B`

## Microtasks Completed

All 4 microtasks in Block 3 are complete:

- **BE-007** — Orders foundation (customer, address, order, order item, order status history models)
- **BE-008** — Public checkout endpoint (`POST /api/public/{tenant_slug}/orders/`)
- **BE-009A** — Require terms acceptance at checkout
- **BE-009B** — Require age confirmation for alcoholic checkout

## Files Changed by Task

### BE-007 — Orders Foundation

**Created:**

- `backend/apps/orders/__init__.py`
- `backend/apps/orders/apps.py`
- `backend/apps/orders/admin.py`
- `backend/apps/orders/models.py`
- `backend/apps/orders/migrations/__init__.py`
- `backend/apps/orders/migrations/0001_initial.py`
- `backend/apps/orders/tests/__init__.py`
- `backend/apps/orders/tests/test_models.py`
- `ai_context/11-QWEN-REPORTS/007-orders-foundation.md`

**Modified:**

- `backend/config/settings.py`
- `ai_context/02-LOG.md`

### BE-008 — Public Checkout Endpoint

**Created:**

- `backend/apps/orders/serializers.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/urls.py`
- `backend/apps/orders/views.py`
- `backend/apps/orders/tests/test_checkout_api.py`
- `ai_context/11-QWEN-REPORTS/008-public-checkout.md`

**Modified:**

- `backend/config/urls.py`
- `ai_context/02-LOG.md`

### BE-009A — Terms Acceptance

**Modified:**

- `backend/apps/orders/serializers.py` — `terms_accepted` changed from `default=False` to `required=True` with explicit validation guard
- `backend/apps/orders/tests/test_checkout_api.py` — `payload()` now includes `terms_accepted: True`; two new tests added
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/009a-terms-acceptance.md`

### BE-009B — Age Confirmation Rules

**Modified:**

- `backend/apps/orders/serializers.py` — Age confirmation logic for alcoholic products
- `backend/apps/orders/tests/test_checkout_api.py` — Five new age confirmation tests
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md`

## Tests Run by Task

### BE-007

- Command: `python -m pytest apps/orders -q`
- Result: 13 model tests (customer, address, order, order item, status history)

### BE-008

- Command: `python -m pytest apps/orders -q`
- Result: 23 tests (checkout API tests added on top of BE-007 models)

### BE-009A

- Command: `python -m pytest -v` (from `backend/`)
- Result: 88 tests passed, 0 failed

### BE-009B

- Command: `python -m pytest apps/orders -q`
- Result: 30 order tests passed
- Command: `python -m pytest`
- Result: 93 tests passed
- Command: `python manage.py check`
- Result: System check identified no issues
- Command: `python manage.py makemigrations --check --dry-run`
- Result: No changes detected

## Overall Test Result

**All 93 tests passed. 0 failed.**

The final test run (after BE-009B) confirms:

- All model tests for orders, customers, addresses, and items pass.
- All checkout API tests pass, including cart validation, tenant isolation, product/variant validation, delivery zone validation, totals calculation, terms enforcement, and age confirmation.
- Django system check is clean.
- No outstanding migrations.

## Deviations from Allowed Scope

**None detected after Codex/OpenCode cleanup.**

All tasks modified only files listed in their respective `ALLOWED FILES TO MODIFY` sections of `ai_context/09-LOCAL-MODEL-TASK-QUEUE.md`. No forbidden files were touched:

- No `frontend/` code.
- No `backend/apps/payments/` code.
- No `backend/apps/compliance/` code.
- No `backend/apps/notifications/` code.
- No payment gateway, WhatsApp API, Docker, Redis, or Kubernetes code.
- No sensitive ID image or document storage.

## Risks or Unresolved Questions

- **Order status transitions** (BE-010) are not yet implemented. The `OrderStatusHistory` model exists from BE-007 but no transition service yet centralizes status changes.
- **Customer reuse** was not implemented in BE-008. Each checkout creates a new customer record. This may need to be addressed in a later milestone if repeated checkouts by the same phone number become necessary.
- **BE-012 (manual payment records)**, **BE-013 (compliance delivery verification)**, and **BE-010 (status transition service)** are pending in Block 4.
- No outstanding blockers or stop conditions were triggered during this block.

## Ready for Codex/OpenCode Review

**Yes.** All 4 microtasks in Block 3 are complete, all tests pass, no deviations from allowed scope were detected, and no blockers or stop conditions were triggered. The block is ready for Codex/OpenCode review.
