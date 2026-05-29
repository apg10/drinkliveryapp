# BE-012A: Payments app and PaymentRecord model

## Task ID

BE-012A

## Summary

Created the `apps.payments` Django app foundation with the `PaymentRecord` model, Django admin registration, migrations, and model tests. No payment gateway code, no API endpoints, and no admin API or compliance code.

## Files Changed

- `backend/config/settings.py` - Added `apps.payments` to `INSTALLED_APPS`
- `backend/apps/payments/__init__.py` - Created by `startapp`
- `backend/apps/payments/apps.py` - Created by `startapp`, updated `name` to `apps.payments`
- `backend/apps/payments/models.py` - Created `PaymentRecord` model
- `backend/apps/payments/admin.py` - Registered `PaymentRecord` in Django admin
- `backend/apps/payments/migrations/0001_initial.py` - Created by `makemigrations`
- `backend/apps/payments/tests/__init__.py` - Created
- `backend/apps/payments/tests/test_models.py` - Created with 10 test cases
- `ai_context/02-LOG.md` - Added BE-012A execution entry
- `ai_context/11-QWEN-REPORTS/012a-payment-record-model.md` - This report

## Tests Added or Updated

File: `backend/apps/payments/tests/test_models.py`

1. `test_can_create_payment_record` - PaymentRecord can be created with all required fields
2. `test_payment_record_related_to_order` - Foreign key to Order works correctly, reverse relation accessible
3. `test_optional_reference_can_be_blank` - `reference` field accepts empty string
4. `test_optional_notes_can_be_blank` - `notes` field accepts empty string
5. `test_string_representation_is_useful` - `__str__` includes order code, method display, status display
6. `test_payment_status_choices` - All 5 payment statuses (PENDING, CONFIRMED, FAILED, REFUNDED, CANCELLED) work
7. `test_payment_method_choices` - All 4 payment methods (CASH, TRANSFER, YAPPY_MANUAL, OTHER_MANUAL) work
8. `test_confirmed_at_can_be_set` - `confirmed_at` timestamp field accepts values
9. `test_timestamps_are_set` - `created_at` and `updated_at` auto-set correctly
10. `test_default_status_is_pending` - Default status is `PENDING`

## Test Command Run

```
cd backend
python -m pytest apps/payments -q
```

## Test Result

10 passed in 0.21s - all tests passing, 0 failed.

## Notes or Risks

- PaymentRecord model aligns with `07-DATA-MODEL-DRAFT.md` exactly (all fields match).
- PaymentMethod and Status choices match `05-BUSINESS-RULES.md` exactly.
- Model uses `confirmed_at` (nullable) instead of auto-setting on CONFIRMED status - no signal logic added per scope.
- Admin registration includes list_display, list_filter, search_fields, and readonly_fields following existing admin conventions.
- No payment gateway code created.
- No payment API endpoints created (per scope).
- No frontend code, compliance code, notification code, or admin API created.
- `confirmed_at` is intended for manual confirmation at a later time; BE-012B will add the service layer for marking payments as confirmed.

## Ready for Codex/OpenCode Review

Yes
