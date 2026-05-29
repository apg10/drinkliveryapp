# BLOCK-4: Status, Payments, And Compliance

## 1. Block ID And Title

`BLOCK-4`: Status, Payments, And Compliance

## 2. Microtasks Completed

- `BE-010`: Order status transition helper
- `BE-011A`: Public order status endpoint
- `BE-012A`: Payments app and PaymentRecord model
- `BE-012B`: Manual payment service
- `BE-013A`: Compliance models
- `BE-013B`: Delivery verification service

Reports:

- `ai_context/11-QWEN-REPORTS/010-order-status-history.md`
- `ai_context/11-QWEN-REPORTS/011a-public-order-status.md`
- `ai_context/11-QWEN-REPORTS/012a-payment-record-model.md`
- `ai_context/11-QWEN-REPORTS/012b-manual-payment-service.md`
- `ai_context/11-QWEN-REPORTS/013a-compliance-models.md`
- `ai_context/11-QWEN-REPORTS/013b-delivery-verification-service.md`

## 3. Files Changed By Task

### BE-010

- `backend/apps/orders/services.py`
- `backend/apps/orders/tests/test_models.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/010-order-status-history.md`

### BE-011A

- `backend/apps/orders/views.py`
- `backend/apps/orders/urls.py`
- `backend/apps/orders/tests/test_public_order_status.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/011a-public-order-status.md`

### BE-012A

- `backend/config/settings.py`
- `backend/apps/payments/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/012a-payment-record-model.md`

### BE-012B

- `backend/apps/payments/services.py`
- `backend/apps/payments/tests/test_services.py`
- `backend/apps/payments/apps.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/012b-manual-payment-service.md`

### BE-013A

- `backend/config/settings.py`
- `backend/apps/compliance/`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/013a-compliance-models.md`

### BE-013B

- `backend/apps/compliance/services.py`
- `backend/apps/compliance/tests/test_delivery_verification_service.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/013b-delivery-verification-service.md`

## 4. Tests Run By Task

- BE-010: order status transition tests.
- BE-011A: public order status API tests.
- BE-012A: payment model tests.
- BE-012B: manual payment service tests.
- BE-013A: compliance model tests.
- BE-013B: delivery verification service tests.

## 5. Overall Test Result

Final verification run by Codex/OpenCode:

```text
python -m pytest -> 139 passed
python manage.py check -> System check identified no issues
python manage.py makemigrations --check --dry-run -> No changes detected
```

## 6. Deviations From Allowed Scope

- No frontend code was added.
- No payment gateway code was added.
- No WhatsApp API code was added.
- No Docker, Celery, Redis, or Kubernetes code was added.
- No public payment or compliance endpoints were added.
- No ID images, document images, document numbers, or sensitive ID data fields were added.
- Compliance models were corrected during review so `DeliveryVerification` and `ComplianceEvent` must always relate to an order.

## 7. Risks Or Unresolved Questions

- Status transitions remain intentionally permissive. A stricter state machine can be added later if operational needs require it.
- Payment service is manual only and does not integrate external providers.
- Delivery verification is a service only; admin/API exposure is deferred to later admin tasks.

## 8. Ready For Codex/OpenCode Review

Yes.
