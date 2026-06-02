# FE-004B1 - Delivery Zones API Helper

## Summary

Added `getPublicDeliveryZones(tenantSlug)` helper to `frontend/src/api.js` that calls the public delivery zones endpoint. No UI changes, no checkout logic, no dependencies added.

## Files Changed

- `frontend/src/api.js` — added `getPublicDeliveryZones` export

## API Helper Added

```js
export function getPublicDeliveryZones(tenantSlug) {
  return apiGet(`/public/${tenantSlug}/delivery-zones/`)
}
```

- Calls `GET /api/public/{tenantSlug}/delivery-zones/`
- Returns the response body: `{ zones: [{ id, name, city, base_fee, minimum_order_amount, is_active }, ...] }`
- Does not change any existing exports or behavior

## Build Result

`npm run build` — passed (533ms, 29 modules transformed)

## Notes

- Backend endpoint already exists at `backend/apps/delivery/views.py:9` (BE-006).
- Endpoint matrix at `ai_context/14-ENDPOINT-MATRIX.md:10` confirms GET `/api/public/{tenant_slug}/delivery-zones/`.
- No checkout UI changes were made (as per task restrictions).
