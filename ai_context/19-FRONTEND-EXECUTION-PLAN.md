# Frontend Execution Plan

## Current Frontend Status

The frontend MVP is complete through `FE-009` (Demo Readiness QA Handoff).

All frontend planning and execution from `FE-001` through `FE-009` has been completed.

### Completed tasks

- `FE-001A` + `FE-001B`: React + Vite frontend skeleton, API client with configured base URL.
- `FE-002A` + `FE-002B`: Public catalog fetch/display, product detail view without a routing library.
- `FE-003A`: In-memory cart state and cart view.
- `FE-004A` through `FE-004D`: Checkout view shell, delivery-zone fetch/display/select, selected-zone checkout totals, checkout submission to `POST /public/{tenant_slug}/orders/`, order confirmation, checkout review cleanup.
- `FE-005A`: Public order tracking via `GET /public/{tenant_slug}/orders/{order_code}/status/` with safe fields only.
- `FE-006A` through `FE-006D`: Admin API helpers, admin orders list shell with 401/403 handling, admin order detail view, admin dashboard summary panel with independent loading.
- `FE-007A` through `FE-007D`: Admin mutation API helpers (status, payment, delivery verification), admin action UI panels (status update, payment recording, delivery verification) with submitting/error/success states.
- `FE-008`: MVP end-to-end review hardening. Fixed missing `OTHER_MANUAL` payment option in public checkout.
- `FE-009`: Demo/staging QA readiness, documentation updates, privacy/compliance confirmation, build verification.

### Current frontend files

- `frontend/src/App.jsx`
- `frontend/src/api.js`
- `frontend/src/components/HomeCatalog.jsx`
- `frontend/src/components/HomeCatalog.css`
- `frontend/src/components/ProductDetail.jsx`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/components/OrderConfirmation.jsx`
- `frontend/src/components/OrderTracking.jsx`
- `frontend/src/components/AdminOrders.jsx`
- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`

### Current design reference

- Use the existing premium dark glassmorphism implementation in `frontend/src/styles.css` as the source of truth. The Stitch source folder is not present in this repository.

### Not implemented (out of MVP scope)

- Admin login UI, token storage, or auth flows. Admin access relies entirely on backend session.
- Product admin (CRUD endpoints). Only admin order read/mutation endpoints are present.
- Payment gateway integration.
- WhatsApp API integration.
- Sensitive ID document storage or upload.

## Frontend Rules For Qwen

- Execute exactly one `FE-*` microtask per chat/session.
- Read the required context before editing.
- Modify only the files allowed by the assigned task.
- Do not add dependencies unless the task explicitly allows it.
- Do not add React Router yet. Keep view switching in `App.jsx` state.
- Do not add TypeScript migration.
- Do not add Tailwind, Material Symbols CDN, CSS-in-JS, or UI component libraries.
- Do not add backend code.
- Do not add authentication unless explicitly assigned.
- Do not add real payment gateways.
- Do not add WhatsApp API integration.
- Do not store sensitive ID images, document numbers, or document uploads.
- Preserve the premium dark glassmorphism direction already in `frontend/src/styles.css`.
- Run `npm run build` from `frontend/` after every task.
- Write a report in `ai_context/11-QWEN-REPORTS/` after every task.

## Next Possible Blocks

### Backend/staging integration smoke test

Verify all public and admin endpoints respond correctly to frontend payload shapes with a running backend and seeded data.

### Admin auth strategy

Define the auth strategy for admin access (session, JWT, etc.) and implement the admin login UI when the backend auth endpoint is ready.

### Product admin

Only after backend product CRUD endpoints are implemented/approved. Currently out of scope for the MVP.

### Deployment UI polish

Review demo/staging UX, loading states, error copy, and compliance messaging before going live.
