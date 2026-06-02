# FE-004C1: Public Checkout API Helper

## Summary

Added `apiPost(path, payload)` and `createPublicOrder(tenantSlug, payload)` helpers to `frontend/src/api.js`. The POST helper mirrors `apiGet` URL resolution logic and handles JSON payloads and error responses. `createPublicOrder` targets the public checkout endpoint and is not yet wired to the checkout form.

## Files Changed

- **Modified:** `frontend/src/api.js` — added `apiPost` and `createPublicOrder`
- **Created:** `ai_context/11-QWEN-REPORTS/fe-004c1-public-checkout-api-helper.md` — this report

## API Helper Behavior

### `apiPost(path, payload)`

- Builds URLs using the same trailing-slash resolution as `apiGet`: when `baseUrl` ends with `/` and `path` starts with `/`, the trailing slash is stripped before concatenation.
- Sends `fetch` with `method: 'POST'`, `Content-Type: application/json`, and `JSON.stringify(payload)` as the body.
- Parses JSON responses on success.
- On failure, attempts to extract error details from the JSON response body (checks `error`, `detail`, or top-level fields) and throws a readable Error. Falls back to a generic message including the URL and HTTP status.

### `createPublicOrder(tenantSlug, payload)`

- Targets `POST /public/{tenant_slug}/orders/` using `baseUrl` for the full URL.
- Delegates to `apiPost`.
- Does not import or call `createPublicOrder` from any other module.

## Error Handling Behavior

- Non-OK responses trigger a thrown Error.
- When the backend returns a JSON body with an `error` field (e.g., serializer validation errors from `public_checkout` in `views.py:44-47`), that detail is surfaced in the error message.
- When the error detail is an object (e.g., `{product_id: [...], items: [...]}`), it is stringified via `JSON.stringify`.
- When the response body is not parseable as JSON, falls back to `apiPost {url} -> {status}` message.

## Build Result

- **Command:** `npm run build` (in `frontend/`)
- **Result:** Build succeeded. No errors or warnings.
- **Output:**
  - `dist/index.html` — 0.74 kB
  - `dist/assets/index-DADklqsZ.css` — 37.86 kB
  - `dist/assets/index-orXHPPOg.js` — 225.14 kB

## Notes

- No backend files were modified.
- The checkout form (`CheckoutView.jsx`) and `App.jsx` were not modified; wiring of this helper is future work.
- No new dependencies added.
- No React Router, payment gateway, or WhatsApp integration added.
- No document numbers, document images, or ID uploads handled.
