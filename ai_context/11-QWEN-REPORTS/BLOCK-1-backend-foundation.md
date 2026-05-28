# BLOCK-1: Backend Foundation

## 1. Block ID and Title

`BLOCK-1`: Backend Foundation

## 2. Microtasks Completed

- `BE-001`: Initialize Django backend skeleton with health endpoint
- `BE-002`: Add tenants app foundation

Both microtasks are complete with reports at:
- `ai_context/11-QWEN-REPORTS/001-backend-skeleton.md`
- `ai_context/11-QWEN-REPORTS/002-tenants-foundation.md`

## 3. Files Changed by Task

### BE-001

- `backend/manage.py` - Created (Django management script)
- `backend/requirements.txt` - Created (dependency list)
- `backend/.env.example` - Created (environment variable template)
- `backend/pytest.ini` - Created (pytest configuration)
- `backend/config/__init__.py` - Created (empty)
- `backend/config/settings.py` - Created (Django settings with DRF, corsheaders, SQLite, dotenv)
- `backend/config/urls.py` - Created (root URL config with core app include)
- `backend/config/asgi.py` - Created (ASGI config)
- `backend/config/wsgi.py` - Created (WSGI config)
- `backend/apps/__init__.py` - Created (empty)
- `backend/apps/core/__init__.py` - Created (empty)
- `backend/apps/core/apps.py` - Created (CoreConfig)
- `backend/apps/core/urls.py` - Created (health URL route)
- `backend/apps/core/views.py` - Created (health endpoint view)
- `backend/apps/core/tests/__init__.py` - Created (empty)
- `backend/apps/core/tests/test_health.py` - Created (3 tests)
- `ai_context/02-LOG.md` - Updated (added BE-001 completion entry)

### BE-002

- `backend/config/settings.py` — Added `'apps.tenants'` to `INSTALLED_APPS`
- `backend/apps/tenants/__init__.py` - Created (empty)
- `backend/apps/tenants/apps.py` - Created (`TenantsConfig`)
- `backend/apps/tenants/models.py` - Created `Tenant`, `StorefrontSettings`, `OperatingSchedule` models
- `backend/apps/tenants/admin.py` - Created admin registrations for all three models
- `backend/apps/tenants/tests/__init__.py` - Created (empty)
- `backend/apps/tenants/tests/test_models.py` - Created 13 model tests
- `backend/apps/tenants/migrations/0001_initial.py` - Generated migration
- `ai_context/02-LOG.md` - Updated (added BE-002 completion entry)

## 4. Tests Run by Task

### BE-001

- `test_health_returns_200` — `GET /api/health/` returns HTTP 200
- `test_health_status_is_ok` — response `status` equals `"ok"`
- `test_health_service_is_drinklivery_backend` — response `service` equals `"drinklivery-backend"`

Command: `cd backend && pytest -v -p django`
Result: 3 passed

### BE-002

- `TenantModelTest.test_tenant_creation`
- `TenantModelTest.test_tenant_str`
- `TenantModelTest.test_tenant_slug_unique`
- `TenantModelTest.test_tenant_is_active_default`
- `TenantModelTest.test_tenant_is_active_can_be_false`
- `StorefrontSettingsModelTest.test_storefront_settings_creation`
- `StorefrontSettingsModelTest.test_storefront_settings_str`
- `StorefrontSettingsModelTest.test_storefront_settings_one_to_one`
- `StorefrontSettingsModelTest.test_storefront_settings_cascade_delete`
- `OperatingScheduleModelTest.test_operating_schedule_creation`
- `OperatingScheduleModelTest.test_operating_schedule_str`
- `OperatingScheduleModelTest.test_operating_schedule_many_days`
- `OperatingScheduleModelTest.test_operating_schedule_rejects_orders`

Command: `cd backend && pytest apps/tenants -v`
Result: 13 tenant model tests + 3 existing health tests = 16 passed

## 5. Overall Test Result

All 16 tests passing across the block (3 health tests + 13 tenant model tests).
No failures. No scope-related test breaks.

## 6. Deviations from Allowed Scope

No deviations detected. Both microtasks modified only files listed in their respective allowed file lists. No forbidden files were touched. No unapproved dependencies were added. No frontend code was introduced during these backend milestones.

## 7. Risks or Unresolved Questions

- `REST_FRAMEWORK` setting is not explicitly defined in settings.py. DRF uses defaults, which works for now but should be configured before adding serializers.
- CORS is configured to allow no origins by default. This must be updated before any frontend integration.
- `Tenant.country` uses a `CharField(max_length=2)` with choices, including `OT` for `Other`. This is acceptable for MVP and keeps the field compatible with short country codes.

## 8. Ready for Codex/OpenCode Review

Yes. Block 1 is complete, tested, within scope, and ready for Codex/OpenCode review before Block 2 begins.
