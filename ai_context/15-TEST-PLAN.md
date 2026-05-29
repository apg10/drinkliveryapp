# Test Plan

## Test Stack

- pytest
- pytest-django
- Django REST Framework APIClient
- SQLite test database

## General Rules

1. Every public endpoint needs API tests.
2. Every model behavior needs tests where meaningful.
3. Every business rule needs tests.
4. Every compliance-sensitive rule needs tests.
5. Every checkout calculation needs tests.
6. Every tenant-scoped endpoint needs tenant isolation tests.
7. Local AI must run required tests before reporting completion.

## BE-001 Tests

File:

- `backend/apps/core/tests/test_health.py`

Required tests:

- `GET /api/health/` returns 200.
- Response `status` equals `ok`.
- Response `service` equals `drinklivery-backend`.

## BE-002 Tests

Required model tests:

- Tenant can be created.
- Tenant slug is unique.
- StorefrontSettings belongs to tenant.
- OperatingSchedule belongs to tenant.
- String representations are useful.

## BE-003 Tests

Required model tests:

- Category can be created for tenant.
- Product can be created for tenant and category.
- ProductVariant can be created for product.
- Active flags can be set.
- Display order fields exist.

## BE-004 Tests

Required API tests:

- Catalog endpoint returns 200 for active tenant.
- Inactive categories are excluded.
- Inactive products are excluded.
- Inactive variants are excluded.
- Products from another tenant are excluded.
- Unknown tenant returns 404.
- Response ordering follows display order.

## BE-005 Tests

Required API tests:

- Active product detail returns 200.
- Inactive product returns 404.
- Product under inactive category returns 404.
- Product from another tenant returns 404.
- Inactive variants are excluded.

## BE-006 Tests

Required tests:

- DeliveryZone can be created.
- Active delivery zones endpoint returns 200.
- Inactive zones are excluded.
- Zones from another tenant are excluded.
- Unknown tenant returns 404.

## BE-007 Tests

Required model tests:

- Customer can be created.
- Address can be created.
- Order defaults to `PENDING`.
- Order code is generated and unique.
- OrderItem can be created.
- OrderStatusHistory can be created.

## BE-008 Tests

Required checkout tests:

- Successful checkout creates customer, address, order, and order items.
- Subtotal is calculated correctly.
- Delivery fee is applied.
- Total equals subtotal plus delivery fee.
- Empty cart is rejected.
- Inactive product is rejected.
- Invalid variant is rejected.
- Variant from another product is rejected.
- Delivery zone from another tenant is rejected.

## BE-009A Tests

Required checkout tests:

- Terms acceptance is required for all orders.
- Checkout succeeds when terms are accepted.

## BE-009B Tests

Required compliance checkout tests:

- Alcoholic order without age confirmation is rejected.
- Alcoholic order with age confirmation succeeds.
- Mocktail-only order does not require age confirmation.
- No sensitive ID document field is accepted or stored.

## BE-010 Tests

Required status tests:

- Status helper changes order status.
- Status helper creates history row.
- History records previous and new status.
- Optional note is stored.
- Optional changed_by is stored when provided.

## Later Required Tests

BE-011A:

- Public order status returns safe fields only.
- Unknown order returns 404.
- Order from another tenant is inaccessible.

BE-012A:

- Manual payment record can be created.

BE-012B:

- Payment status can be updated.
- Payment references are not exposed publicly.

BE-013A:

- DeliveryVerification model can be created.
- ComplianceEvent model can be created.
- No document images are stored.

BE-013B:

- Delivery verification can mark order delivered when adult verification passes.
- Failed verification marks order `FAILED_AGE_VERIFICATION`.
- Verification stores receiver name, document checked flag, adult result, timestamp, and verifier.
- No document images are stored.

BE-014A:

- Admin order list works.
- Admin order detail works.

BE-014B:

- Admin status update works.

BE-014C:

- Admin payment update works.

BE-014D:

- Admin delivery verification works.

BE-015A:

- Dashboard returns total orders.
- Dashboard returns pending orders.
- Dashboard returns revenue from confirmed/delivered orders according to final rule.
- Dashboard returns counts by status.
