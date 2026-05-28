# BE-006: Delivery Zones

## Task ID

BE-006

## Summary

Created the `apps.delivery` Django app with a `DeliveryZone` model, admin registration, a SERIALIZER, and a public endpoint `GET /api/public/{tenant_slug}/delivery-zones/`. The endpoint returns only active zones for an active tenant, enforces tenant isolation, and returns 404 for unknown or inactive tenants.

## Files Changed

### New Files

- `backend/apps/delivery/__init__.py`
- `backend/apps/delivery/apps.py`
- `backend/apps/delivery/admin.py`
- `backend/apps/delivery/models.py`
- `backend/apps/delivery/serializers.py`
- `backend/apps/delivery/urls.py`
- `backend/apps/delivery/views.py`
- `backend/apps/delivery/tests/__init__.py`
- `backend/apps/delivery/tests/test_models.py`
- `backend/apps/delivery/tests/test_delivery_zones.py`
- `backend/apps/delivery/migrations/__init__.py`
- `backend/apps/delivery/migrations/0001_initial.py`

### Modified Files

- `backend/config/settings.py` — added `apps.delivery` to `INSTALLED_APPS`
- `backend/config/urls.py` — added `path('api/', include('apps.delivery.urls'))`
- `ai_context/02-LOG.md` — added BE-006 entry

## Tests Added or Updated

### test_models.py (6 tests)

- `test_delivery_zone_creation` — verifies all fields persist correctly
- `test_delivery_zone_str` — verifies `__str__` returns `'name (tenant_name)'`
- `test_delivery_zone_is_active_default` — default is `True`
- `test_delivery_zone_inactivate_can_be_false` — can be set to `False`
- `test_delivery_zone_minimum_order_amount_default` — default is `Decimal('0')`
- `test_delivery_zone_tenant_relation` — zones cascade by tenant, one zone per tenant in test

### test_delivery_zones.py (7 tests)

#### API tests

- `test_active_zones_endpoint_returns_200` — returns 200 for active tenant
- `test_active_zones_endpoint_returns_zones` — returns exactly 1 active zone
- `test_inactive_zones_are_excluded` — inactive zone excluded from response
- `test_tenant_isolation_zones_not_shared` — zones from tenant B not visible in tenant A
- `test_unknown_tenant_returns_404` — nonexistent tenant slug returns 404
- `test_inactive_tenant_returns_404` — inactive tenant returns 404
- `test_zones_include_all_required_fields` — all serializer fields present in response

## Test Command Run

```
cd backend
pytest
```

## Test Result

Passing as part of the full backend suite after cleanup. Duplicate delivery model tests were removed from `test_delivery_zones.py`; model coverage remains in `test_models.py`.

## Notes

- `DeliveryZone` model follows the same pattern as existing apps: `db_table` meta, `related_name` on tenant FK, `is_active` + timestamp fields, `__str__` method.
- Admin panel registration includes `list_display`, `list_filter`, and `search_fields`.
- Serializer uses DRF `ModelSerializer` with explicit field whitelist (no `created_at`/`updated_at` exposed publicly).
- Endpoint uses `JsonResponse` for consistency with existing catalog endpoints.
- Tenant isolation is enforced by filtering `tenant=tenant` at the query level.

## Risks or Unresolved Questions

- None identified. Delivery zones now available for checkout validation in BE-008.

## Ready for Review

Yes, BE-006 is complete and ready for Codex/OpenCode review.
