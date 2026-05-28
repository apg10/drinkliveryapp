# BE-002 Report: Tenants Foundation

## 1. Task ID

`BE-002`

## 2. Summary

Created the `apps.tenants` Django app with three models: `Tenant`, `StorefrontSettings`, and `OperatingSchedule`. The `Tenant` model uses a unique slug for tenant identification and includes country, city, currency, and active flags for multi-market readiness. `StorefrontSettings` uses a one-to-one relation to `Tenant` for brand and contact information. `OperatingSchedule` stores per-day operating windows via a foreign key to `Tenant`. All models include `created_at` and `updated_at` timestamps and Django admin registrations.

## 3. Files Changed

- `backend/config/settings.py` — Added `'apps.tenants'` to `INSTALLED_APPS`.
- `backend/apps/tenants/__init__.py` — Created (empty).
- `backend/apps/tenants/apps.py` — Created `TenantsConfig`.
- `backend/apps/tenants/models.py` — Created `Tenant`, `StorefrontSettings`, `OperatingSchedule` models.
- `backend/apps/tenants/admin.py` — Created admin registrations for all three models.
- `backend/apps/tenants/tests/__init__.py` — Created (empty).
- `backend/apps/tenants/tests/test_models.py` — Created 13 model tests.
- `backend/apps/tenants/migrations/0001_initial.py` — Generated migration.

## 4. Tests Added

- `TenantModelTest.test_tenant_creation` — Tenant can be created with all fields.
- `TenantModelTest.test_tenant_str` — `__str__` returns `name (slug)`.
- `TenantModelTest.test_tenant_slug_unique` — Duplicate slug raises `IntegrityError`.
- `TenantModelTest.test_tenant_is_active_default` — `is_active` defaults to `True`.
- `TenantModelTest.test_tenant_is_active_can_be_false` — `is_active` can be set to `False`.
- `StorefrontSettingsModelTest.test_storefront_settings_creation` — One-to-one relation works.
- `StorefrontSettingsModelTest.test_storefront_settings_str` — `__str__` includes tenant name.
- `StorefrontSettingsModelTest.test_storefront_settings_one_to_one` — Relation is correctly set.
- `StorefrontSettingsModelTest.test_storefront_settings_cascade_delete` — Deleting Tenant cascades to StorefrontSettings.
- `OperatingScheduleModelTest.test_operating_schedule_creation` — Schedule can be created.
- `OperatingScheduleModelTest.test_operating_schedule_str` — `__str__` includes weekday and tenant.
- `OperatingScheduleModelTest.test_operating_schedule_many_days` — Multiple days per tenant work.
- `OperatingScheduleModelTest.test_operating_schedule_rejects_orders` — `accepts_orders` flag works.

## 5. Test Command Run

```
cd backend
pytest -v
```

(Also ran `pytest apps/tenants -v` per task requirements.)

## 6. Test Result

16 passed in 0.34s.

All 13 tenant model tests + 3 existing health tests passing.

## 7. Notes or Risks

- `Tenant.country` uses 2-character country codes, including `OT` for `Other`. This keeps the field compatible with the planned 2-character country code format.
- No API endpoints were created (BE-004 covers that). No migrations needed for other apps.

## 8. Ready for Review

Yes.
