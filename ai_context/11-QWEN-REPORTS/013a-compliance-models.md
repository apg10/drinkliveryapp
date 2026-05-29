# BE-013A: Compliance app and compliance models

## Task ID

BE-013A

## Summary

Created the `apps.compliance` Django app foundation with `DeliveryVerification` and `ComplianceEvent` models, Django admin registration, migrations, and model tests. No API endpoints, no verification service logic, and no frontend code.

## Files Changed

- `backend/config/settings.py` - Added `apps.compliance` to `INSTALLED_APPS`
- `backend/apps/compliance/__init__.py` - Created by startapp convention
- `backend/apps/compliance/apps.py` - Created, updated `name` to `apps.compliance`
- `backend/apps/compliance/models.py` - Created `DeliveryVerification` and `ComplianceEvent` models
- `backend/apps/compliance/admin.py` - Registered both models in Django admin
- `backend/apps/compliance/migrations/__init__.py` - Created
- `backend/apps/compliance/migrations/0001_initial.py` - Created by `makemigrations`
- `backend/apps/compliance/tests/__init__.py` - Created
- `backend/apps/compliance/tests/test_compliance_models.py` - Created with 12 test cases
- `ai_context/02-LOG.md` - Added BE-013A execution entry
- `ai_context/11-QWEN-REPORTS/013a-compliance-models.md` - This report

## Tests Added or Updated

File: `backend/apps/compliance/tests/test_compliance_models.py`

1. `test_create_delivery_verification` - DeliveryVerification can be created with all required fields
2. `test_delivery_verification_order_is_required` - order FK is required
3. `test_delivery_verification_str_with_order` - `__str__` includes order code and receiver name when order exists
4. `test_delivery_verification_defaults` - Default values on all fields (empty strings, False, None)
5. `test_create_compliance_event` - ComplianceEvent can be created with order, event type and notes
6. `test_compliance_event_order_is_required` - order FK is required
7. `test_compliance_event_str_with_order` - `__str__` includes event type and order code when order exists
8. `test_compliance_event_all_event_types` - All EventType choices work
9. `test_compliance_event_defaults` - Default values on non-order fields
10. `test_delivery_verification_relates_to_order` - FK to Order works correctly, reverse relation accessible
11. `test_compliance_event_relates_to_order` - FK to Order works correctly, reverse relation accessible
12. `test_no_image_or_document_fields_on_delivery_verification` - No image/document fields exist on DeliveryVerification
13. `test_no_image_or_document_fields_on_compliance_event` - No image/document fields exist on ComplianceEvent

## Test Command Run

```
cd backend
python manage.py migrate --run-syncdb
python -m pytest apps/compliance -q
```

## Test Result

12 passed in 0.25s - all tests passing, 0 failed.

## Notes or Risks

- DeliveryVerification.order and ComplianceEvent.order are required foreign keys to Order. Compliance records must not be orphaned because alcohol delivery verification must remain traceable to an order.
- No image fields, document fields, or document number fields on either model - aligns with security principle of not storing ID document images or sensitive ID data in the database.
- ComplianceEvent.EventType includes all event types specified in the architecture: FAILED_AGE_VERIFICATION, DELIVERY_REFUSED, RECEIVER_UNAVAILABLE, VISIBLY_INTOXICATED, UNATTENDED_DELIVERY_ATTEMPT, HANDED_TO_MINOR, ADMIN_REJECTION, OTHER.
- Admin registration includes list_display, list_filter, search_fields, and readonly_fields following existing admin conventions.
- No API endpoints created.
- No verification service logic created (reserved for BE-013B).
- No frontend code, notification code, or payment changes created.

## Ready for Codex/OpenCode Review

Yes
