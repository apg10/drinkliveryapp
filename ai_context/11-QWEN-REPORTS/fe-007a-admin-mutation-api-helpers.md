# FE-007A: Admin Mutation API Helpers

## Summary

Added frontend API helpers for existing admin mutation endpoints without adding any UI. Added `apiPatch(path, payload)` helper and improved `apiPost` to preserve HTTP status on errors.

## Files Changed

| File | Change |
|---|---|
| `frontend/src/api.js` | Added `apiPatch`, improved `apiPost` error.status preservation, added 3 admin mutation helpers |
| `frontend/README.md` | Documented `apiPatch`, `updateAdminOrderStatus`, `updateAdminOrderPayment`, `submitAdminDeliveryVerification` |
| `ai_context/02-LOG.md` | Added FE-007A execution entry |
| `ai_context/11-QWEN-REPORTS/fe-007a-admin-mutation-api-helpers.md` | This report |

## Helper Behavior and Endpoint Mapping

### `apiPatch(path, payload)`

- Sends `fetch` request with `method: 'PATCH'` and `Content-Type: application/json`
- Parses JSON response body
- On non-2xx: parses `error`, `detail`, or formatted message from response JSON
- Sets `error.status = res.status` on thrown errors
- On JSON parse failure: still throws with `error.status = res.status`

### `updateAdminOrderStatus(id, payload)`

- Calls `apiPatch(\`/admin/orders/${id}/status/\`, payload)`
- Payload shape: `{ status, note }`
- Maps to backend `admin_order_status_update` view

### `updateAdminOrderPayment(id, payload)`

- Calls `apiPatch(\`/admin/orders/${id}/payment/\`, payload)`
- Payload shape: `{ method, status, amount, reference, notes }`
- Maps to backend `admin_order_payment_update` view

### `submitAdminDeliveryVerification(id, payload)`

- Calls `apiPost(\`/admin/orders/${id}/delivery-verification/\`, payload)`
- Payload shape: `{ receiver_name, receiver_document_checked, receiver_is_adult, verification_notes }`
- Maps to backend `admin_delivery_verification` view
- Uses `POST` (not `PATCH`) per the backend endpoint

### `apiPost` improvement

- `error.status = res.status` now preserved on non-2xx responses (previously only the error message was thrown without status)
- Catch handler now checks `e.status` before re-wrapping, consistent with `apiGet` pattern
- No checkout behavior affected — parsing and error throwing logic remains the same

## Explicit Confirmations

### No UI added
Confirmed: no admin action forms, buttons, views, or any UI components were added. Only API helper functions exported from `api.js`.

### No auth flow added
Confirmed: no login UI, token storage, or authentication flows were added. All helpers rely on pre-existing backend admin authentication.

### No sensitive ID fields added
Confirmed: no `document_number`, `document_image`, ID upload, image upload, or other sensitive ID collection/storage fields were added in any form, state, or payload shape.

### No new dependencies
Confirmed: no new npm packages were added. Only standard `fetch` API used.

### No React Router
Confirmed: no routing library added or referenced.

## Build Result

```
npm run build from frontend/
```

Result: Build passed (0 errors).
