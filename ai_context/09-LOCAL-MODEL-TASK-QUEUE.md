# Local Model Task Queue

## Instructions

Qwen/local AI must execute exactly one assigned microtask per chat/session.

Blocks are planning and review boundaries, not single local AI chats.

Inside an assigned block, Adrian starts a separate local AI chat for each microtask.

Do not start a microtask until Codex/OpenCode assigns it.

Do not start the next block until the previous block is reviewed.

Each task requires a report in `ai_context/11-QWEN-REPORTS/`.

Each block requires a block summary report as defined in `ai_context/16-BLOCK-EXECUTION-PLAN.md`. The block summary is a separate final chat after all microtasks in the block are complete.

## Block Assignment Order

- Block 1: `BE-001`, `BE-002`
- Block 2: `BE-003`, `BE-004`, `BE-005`, `BE-006`
- Block 3: `BE-007`, `BE-008`, `BE-009A`, `BE-009B`
- Block 4: `BE-010`, `BE-011A`, `BE-012A`, `BE-012B`, `BE-013A`, `BE-013B`
- Block 5: `BE-014A`, `BE-014B`, `BE-014C`, `BE-014D`, `BE-015A`
- Block 6: `BE-016`, `BE-017`

See `ai_context/16-BLOCK-EXECUTION-PLAN.md` for block goals and review boundaries.

## BE-001

TASK ID: `BE-001`

TITLE: Initialize Django backend skeleton with health endpoint

OBJECTIVE: Create the initial backend foundation only.

CONTEXT FILES TO READ:

- `ai_context/00-PLAN.md`
- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/04-APP-BRIEF.md`
- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/08-MVP-SCOPE.md`
- `ai_context/13-ARCHITECTURE.md`
- `ai_context/15-TEST-PLAN.md`

ALLOWED FILES TO MODIFY:

- `backend/manage.py`
- `backend/requirements.txt`
- `backend/.env.example`
- `backend/pytest.ini`
- `backend/config/__init__.py`
- `backend/config/settings.py`
- `backend/config/urls.py`
- `backend/config/asgi.py`
- `backend/config/wsgi.py`
- `backend/apps/__init__.py`
- `backend/apps/core/__init__.py`
- `backend/apps/core/apps.py`
- `backend/apps/core/urls.py`
- `backend/apps/core/views.py`
- `backend/apps/core/tests/__init__.py`
- `backend/apps/core/tests/test_health.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/001-backend-skeleton.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/tenants/`
- `backend/apps/products/`
- `backend/apps/orders/`
- `backend/apps/delivery/`
- `backend/apps/payments/`
- `backend/apps/compliance/`
- `backend/apps/notifications/`
- Docker files
- CI/CD files

IMPLEMENTATION REQUIREMENTS:

- Create Django project under `backend/`.
- Use a single `backend/config/settings.py`.
- Configure `rest_framework`.
- Configure `corsheaders`.
- Configure SQLite local database.
- Configure `python-dotenv` for `.env` loading.
- Add `GET /api/health/`.
- Health response must be `{ "status": "ok", "service": "drinklivery-backend" }`.
- Do not create business models.
- Do not add authentication.
- Do not add frontend code.

TEST REQUIREMENTS:

- Create `backend/apps/core/tests/test_health.py`.
- Test `GET /api/health/` returns status code 200.
- Test response `status` equals `ok`.
- Test response `service` equals `drinklivery-backend`.

COMMANDS TO RUN:

- `cd backend`
- `pytest`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/001-backend-skeleton.md`

## BE-002

TASK ID: `BE-002`

TITLE: Add tenants app foundation

OBJECTIVE: Add tenant, storefront settings, and operating schedule models.

CONTEXT FILES TO READ:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/07-DATA-MODEL-DRAFT.md`
- `ai_context/13-ARCHITECTURE.md`
- `backend/config/settings.py`

ALLOWED FILES TO MODIFY:

- `backend/config/settings.py`
- `backend/apps/tenants/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/002-tenants-foundation.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/products/`
- `backend/apps/orders/`
- `backend/apps/delivery/`
- `backend/apps/payments/`
- `backend/apps/compliance/`
- `backend/apps/notifications/`

IMPLEMENTATION REQUIREMENTS:

- Create `apps.tenants` Django app.
- Add `Tenant`, `StorefrontSettings`, and `OperatingSchedule`.
- Use unique tenant slug.
- Add useful `__str__` methods.
- Add timestamp fields.
- Register models in Django admin.
- Create migrations.

TEST REQUIREMENTS:

- Test tenant creation.
- Test unique slug behavior.
- Test storefront settings relation to tenant.
- Test operating schedule relation to tenant.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/tenants`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/002-tenants-foundation.md`

## BE-003

TASK ID: `BE-003`

TITLE: Add product catalog models

OBJECTIVE: Add categories, products, and variants for tenant-specific catalog.

CONTEXT FILES TO READ:

- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/07-DATA-MODEL-DRAFT.md`
- `ai_context/13-ARCHITECTURE.md`
- `backend/apps/tenants/models.py`

ALLOWED FILES TO MODIFY:

- `backend/config/settings.py`
- `backend/apps/products/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/003-product-catalog-models.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/orders/`
- `backend/apps/delivery/`
- `backend/apps/payments/`
- `backend/apps/compliance/`
- `backend/apps/notifications/`

IMPLEMENTATION REQUIREMENTS:

- Create `apps.products` Django app.
- Add `Category`, `Product`, and `ProductVariant`.
- Associate categories and products with tenant.
- Enforce product belongs to its category tenant at validation/model clean if practical.
- Include `is_active` and `display_order` fields.
- Register models in admin.
- Create migrations.

TEST REQUIREMENTS:

- Test category creation.
- Test product creation.
- Test variant creation.
- Test ordering fields exist.
- Test inactive flags can be set.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/products`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/003-product-catalog-models.md`

## BE-004

TASK ID: `BE-004`

TITLE: Add public catalog endpoint

OBJECTIVE: Expose active tenant catalog through a public endpoint.

CONTEXT FILES TO READ:

- `ai_context/13-ARCHITECTURE.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `backend/apps/tenants/models.py`
- `backend/apps/products/models.py`

ALLOWED FILES TO MODIFY:

- `backend/config/urls.py`
- `backend/apps/products/serializers.py`
- `backend/apps/products/urls.py`
- `backend/apps/products/views.py`
- `backend/apps/products/tests/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/004-public-catalog-endpoint.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/orders/`
- `backend/apps/payments/`
- `backend/apps/compliance/`

IMPLEMENTATION REQUIREMENTS:

- Add `GET /api/public/{tenant_slug}/catalog/`.
- Return active categories for active tenant.
- Return active products only.
- Return active variants only.
- Preserve tenant isolation.
- Order categories, products, and variants by `display_order` then `id`.

TEST REQUIREMENTS:

- Test active catalog returns 200.
- Test inactive products are excluded.
- Test inactive variants are excluded.
- Test inactive categories are excluded.
- Test tenant isolation.
- Test unknown tenant returns 404.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/products/tests`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/004-public-catalog-endpoint.md`

## BE-005

TASK ID: `BE-005`

TITLE: Add public product detail endpoint

OBJECTIVE: Expose one active product by tenant and product slug.

CONTEXT FILES TO READ:

- `ai_context/14-ENDPOINT-MATRIX.md`
- `backend/apps/products/models.py`
- `backend/apps/products/serializers.py`
- `backend/apps/products/views.py`

ALLOWED FILES TO MODIFY:

- `backend/apps/products/serializers.py`
- `backend/apps/products/urls.py`
- `backend/apps/products/views.py`
- `backend/apps/products/tests/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/005-public-product-detail.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/orders/`
- `backend/apps/payments/`
- `backend/apps/compliance/`

IMPLEMENTATION REQUIREMENTS:

- Add `GET /api/public/{tenant_slug}/products/{product_slug}/`.
- Return product only if product, category, and tenant are active.
- Include active variants only.
- Do not expose admin-only fields.

TEST REQUIREMENTS:

- Test active product detail returns 200.
- Test inactive product returns 404.
- Test product from another tenant returns 404.
- Test inactive variant is excluded.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/products/tests`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/005-public-product-detail.md`

## BE-006

TASK ID: `BE-006`

TITLE: Add delivery zones

OBJECTIVE: Add delivery zones and public active zones endpoint.

CONTEXT FILES TO READ:

- `ai_context/07-DATA-MODEL-DRAFT.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `backend/apps/tenants/models.py`

ALLOWED FILES TO MODIFY:

- `backend/config/settings.py`
- `backend/config/urls.py`
- `backend/apps/delivery/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/006-delivery-zones.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/orders/`
- `backend/apps/payments/`
- `backend/apps/compliance/`

IMPLEMENTATION REQUIREMENTS:

- Create `apps.delivery` Django app.
- Add `DeliveryZone` model.
- Register model in admin.
- Add `GET /api/public/{tenant_slug}/delivery-zones/`.
- Return active zones only for active tenant.
- Create migrations.

TEST REQUIREMENTS:

- Test delivery zone model creation.
- Test active zones endpoint.
- Test inactive zones are excluded.
- Test tenant isolation.
- Test unknown tenant returns 404.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/delivery`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/006-delivery-zones.md`

## BE-007

TASK ID: `BE-007`

TITLE: Add orders foundation

OBJECTIVE: Add customer, address, order, order item, and order status history models.

CONTEXT FILES TO READ:

- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/07-DATA-MODEL-DRAFT.md`
- `backend/apps/tenants/models.py`
- `backend/apps/products/models.py`
- `backend/apps/delivery/models.py`

ALLOWED FILES TO MODIFY:

- `backend/config/settings.py`
- `backend/apps/orders/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/007-orders-foundation.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/payments/`
- `backend/apps/compliance/`
- `backend/apps/notifications/`

IMPLEMENTATION REQUIREMENTS:

- Create `apps.orders` Django app.
- Add `Customer`, `Address`, `Order`, `OrderItem`, `OrderStatusHistory`.
- Add order status choices.
- Add payment method and payment status choices on `Order` for initial manual tracking.
- Generate unique public `order_code`.
- Store subtotal, delivery fee, and total as decimal fields.
- Register models in admin.
- Create migrations.

TEST REQUIREMENTS:

- Test customer and address creation.
- Test order creation with default `PENDING` status.
- Test unique order code generation.
- Test order item total calculation if implemented at model/service level.
- Test status history creation model exists and can be created.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/orders`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/007-orders-foundation.md`

## BE-008

TASK ID: `BE-008`

TITLE: Add public checkout endpoint

OBJECTIVE: Create public order checkout with cart validation and totals.

CONTEXT FILES TO READ:

- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `backend/apps/products/models.py`
- `backend/apps/delivery/models.py`
- `backend/apps/orders/models.py`

ALLOWED FILES TO MODIFY:

- `backend/config/urls.py`
- `backend/apps/orders/serializers.py`
- `backend/apps/orders/urls.py`
- `backend/apps/orders/views.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/tests/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/008-public-checkout.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/payments/`
- `backend/apps/compliance/`
- Payment gateway code
- WhatsApp API code

IMPLEMENTATION REQUIREMENTS:

- Add `POST /api/public/{tenant_slug}/orders/`.
- Create or reuse customer by phone only if simple and explicit; otherwise create new customer record.
- Create address.
- Validate delivery zone belongs to tenant and is active.
- Validate cart has at least one item.
- Validate product is active and belongs to tenant.
- Validate variant, if supplied, is active and belongs to product.
- Calculate subtotal from product or variant prices.
- Use delivery zone base fee.
- Calculate total as subtotal plus delivery fee.
- Create order with `PENDING` status.
- Do not integrate payments.

TEST REQUIREMENTS:

- Test successful checkout.
- Test subtotal and total calculation.
- Test inactive product is rejected.
- Test invalid variant is rejected.
- Test delivery zone tenant isolation.
- Test empty cart is rejected.
- Test unknown tenant returns 404.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/orders/tests`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/008-public-checkout.md`

## BE-009A

TASK ID: `BE-009A`

TITLE: Require terms acceptance at checkout

OBJECTIVE: Enforce `terms_accepted=true` for all checkout orders.

CONTEXT FILES TO READ:

- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `backend/apps/orders/serializers.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/views.py`

ALLOWED FILES TO MODIFY:

- `backend/apps/orders/serializers.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/tests/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/payments/`
- ID image storage
- Document upload code

IMPLEMENTATION REQUIREMENTS:

- Require `terms_accepted=true` for all checkouts.
- Store terms acceptance flag on order.
- Do not store ID images or sensitive document data.

TEST REQUIREMENTS:

- Test terms acceptance is required for all orders.
- Test checkout succeeds when terms are accepted.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/orders/tests`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/009a-terms-acceptance.md`

## BE-009B

TASK ID: `BE-009B`

TITLE: Require age confirmation for alcoholic checkout

OBJECTIVE: Enforce `age_confirmed_by_customer=true` only when cart contains alcoholic products.

CONTEXT FILES TO READ:

- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `backend/apps/products/models.py`
- `backend/apps/orders/serializers.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/views.py`

ALLOWED FILES TO MODIFY:

- `backend/apps/orders/serializers.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/tests/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/payments/`
- ID image storage
- Document upload code

IMPLEMENTATION REQUIREMENTS:

- Detect if checkout cart contains any alcoholic product.
- Require `age_confirmed_by_customer=true` if cart contains alcoholic products.
- Do not require age confirmation for mocktail-only orders.
- Store age confirmation flag on order.
- Do not store ID images, document images, document numbers, or sensitive ID data.

TEST REQUIREMENTS:

- Test alcoholic order without age confirmation is rejected.
- Test alcoholic order with age confirmation succeeds.
- Test mocktail-only order does not require age confirmation.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/orders/tests`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md`

## BE-010

TASK ID: `BE-010`

TITLE: Add order status transition history

OBJECTIVE: Centralize order status changes and create history records.

CONTEXT FILES TO READ:

- `ai_context/05-BUSINESS-RULES.md`
- `backend/apps/orders/models.py`

ALLOWED FILES TO MODIFY:

- `backend/apps/orders/models.py`
- `backend/apps/orders/services.py`
- `backend/apps/orders/tests/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/010-order-status-history.md`

FORBIDDEN FILES:

- `frontend/`
- `backend/apps/payments/`
- `backend/apps/compliance/`

IMPLEMENTATION REQUIREMENTS:

- Add a small status transition service/helper.
- Create `OrderStatusHistory` whenever status changes through the helper.
- Preserve previous and new status.
- Allow optional `changed_by` and `note`.
- Keep transition rules minimal at this stage.

TEST REQUIREMENTS:

- Test status update changes order status.
- Test status update creates history.
- Test no history is created when status does not change, if implemented.
- Test note and changed_by can be stored.

COMMANDS TO RUN:

- `cd backend`
- `pytest apps/orders/tests`

REPORT FILE:

- `ai_context/11-QWEN-REPORTS/010-order-status-history.md`

## BE-011 Through BE-017 Summary

BE-011A: Public order status endpoint.

BE-012A: Payments app and PaymentRecord model.

BE-012B: Manual payment record service.

BE-013A: Compliance models.

BE-013B: Delivery verification service.

BE-014A: Admin order list and detail endpoints.

BE-014B: Admin order status update endpoint.

BE-014C: Admin payment update endpoint.

BE-014D: Admin delivery verification endpoint.

BE-015A: Dashboard summary endpoint.

BE-016: Seed data for Drinklivery Panama.

BE-017: Deployment preparation docs and environment tightening.

These tasks must be expanded before assignment.
