# Drinklivery Log

## 2026-05-28

- Created initial AI planning context for Drinklivery.
- Confirmed current phase is planning, not implementation.
- Prepared architecture, endpoint matrix, test plan, worker protocol, and local AI task queue.
- Backend implementation remains blocked until Block 1 is explicitly started.
- Updated workflow to use block-based local AI execution.
- First implementation block is Block 1: BE-001 and BE-002.
- Added Git/GitHub workflow policy and base version control files.
- Reviewed Block 1 and applied cleanup: aligned Django requirement with generated migrations, removed unused `pytest-env`, and corrected tenant country notes in reports.
- Prepared local AI prompts for Block 2: BE-003 through BE-006 plus Block 2 summary.
- BE-001 executed: Django backend skeleton created with health endpoint, all dependencies installed, migrations run, 3/3 tests passing.
- BE-002 executed: tenants app created with Tenant, StorefrontSettings, OperatingSchedule models. All 16 tests passing (3 health + 13 tenants).
- BE-004 executed: public catalog endpoint added at GET /api/public/{tenant_slug}/catalog/ with serializers, urls, view, and 8 API tests. All 16 tests passing (3 health + 13 tenants + 8 catalog).
- BE-005 executed: public product detail endpoint added at GET /api/public/{tenant_slug}/products/{product_slug}/ with active filtering, tenant/category isolation, and 10 API tests. All 30 tests passing.
- BE-006 executed: delivery app created with DeliveryZone model, admin registration, GET /api/public/{tenant_slug}/delivery-zones/ endpoint, serialization, and delivery model/API tests.
- Block 2 cleanup applied: added missing BE-003 and block reports, changed product/category slug uniqueness to per-tenant constraints, removed dead ProductVariant validation, and removed duplicate delivery model tests from API test file.
- Prepared local AI prompts for Block 3: BE-007 through BE-009 plus Block 3 summary.
- BE-007 completed in Codex/OpenCode after Qwen stalled on tests: orders app foundation created with Customer, Address, Order, OrderItem, OrderStatusHistory, admin registration, migration, and 13 model tests.
- BE-008 completed in Codex/OpenCode after Qwen stalled: public checkout endpoint added with nested request validation, cart validation, total calculation, and checkout API tests.
- Split BE-009 into BE-009A terms acceptance and BE-009B alcoholic age confirmation to reduce local AI context size.
- BE-009A executed: terms_accepted made required in CheckoutSerializer (required=True + validate guard), included in checkout response, and default payload updated. Added 2 test cases: rejection when false and success when true. All 88 tests passing (0 failed).
- BE-009B executed: age_confirmed_by_customer enforcement added to CheckoutSerializer validate() for alcoholic product carts. Products with is_alcoholic=True now require age_confirmed_by_customer=true, mocktail-only orders bypass this check, and mixed carts also require it. Added 5 new test cases covering alcoholic rejection/success, mocktail-only bypass, and mixed cart enforcement. All 30 orders tests passing (17 checkout + 13 models).
- Block 3 cleanup applied: tenant validation now runs before checkout compliance validation, BE-009A report scope was corrected, and checkout response was kept within BE-008 shape.
- Split Block 4 into smaller tasks: BE-011A, BE-012A, BE-012B, BE-013A, and BE-013B.
- BE-010 executed: `transition_order_status` service added to `services.py` - creates `OrderStatusHistory` on status change, no-op when status unchanged, supports optional `changed_by` and `note` params. 4 new tests added. All 34 tests passing.
- BE-011A executed: public order status endpoint added at GET /api/public/{tenant_slug}/orders/{order_code}/status/ with tenant isolation, safe-field-only response, and 5 API tests. All 102 tests passing.
- BE-012A executed: payments app created with PaymentRecord model (order, method, status, amount, reference, notes, confirmed_at, created_at, updated_at), admin registration, migration, and 10 model tests. All 10 tests passing.
- BE-012B completed in Codex/OpenCode after Qwen stalled: manual payment service added with order payment status update, reference/notes storage, confirmed_at handling, and public status non-exposure tests.
- Block 4 cleanup applied: compliance records now require an Order relation, orphan compliance records were removed from tests/docs, and Block 4 summary was created.
- BE-013A executed: compliance app created with DeliveryVerification and ComplianceEvent models, Django admin registration, migrations, and 12 model tests. No API endpoints, no verification service logic, and no image/document fields per security principles. 12/12 tests passing.
- BE-013B executed: `record_delivery_verification` service added to `apps/compliance/services.py` - creates DeliveryVerification, transitions order to DELIVERED when adult+document verified, creates ComplianceEvent and marks FAILED_AGE_VERIFICATION when verification fails, no sensitive ID/data storage, 8 new tests. All 59 tests passing.
