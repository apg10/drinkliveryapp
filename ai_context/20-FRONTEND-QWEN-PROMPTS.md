# Frontend Qwen Prompts

Use these prompts one at a time. Start a fresh Qwen/local AI chat for each microtask.

## Prompt: FE-004A1 Checkout Route Shell

Task: `FE-004A1` only. Add the smallest checkout view route shell. Do not add the full checkout form yet.

You are working in the Drinklivery repo. Keep this task small.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `frontend/src/App.jsx`
- `frontend/src/styles.css`

Allowed files to modify:

- `frontend/src/App.jsx`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`
- `ai_context/11-QWEN-REPORTS/fe-004a1-checkout-route-shell.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add checkout API POST or any fetch call.
- Do not modify `frontend/src/api.js`.
- Do not modify `frontend/src/components/ProductDetail.jsx`.
- Do not update README or LOG in this task.

Implementation requirements:

- Create `frontend/src/components/CheckoutView.jsx`.
- The component must accept `cartItems`, `cartSubtotal`, `deliveryFee`, `onBackToCart`, and `onBackToCatalog` props.
- Render a simple checkout page title, a short responsible-delivery note, and a back-to-cart button.
- If `cartItems.length === 0`, render an empty checkout state with a return-to-catalog button.
- In `App.jsx`, import `CheckoutView`.
- In `App.jsx`, replace the cart checkout alert with `setView('checkout')`.
- In `App.jsx`, add `if (view === 'checkout')` rendering for `CheckoutView`.
- Keep existing cart behavior unchanged except the checkout button navigation.
- Preserve the dark glassmorphism style using `frontend/src/styles.css`.

Command to run:

- From `frontend/`: `npm run build`

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004a1-checkout-route-shell.md`

Report must include:

- Summary.
- Files changed.
- Build result.
- Confirm no API POST/fetch was added.

## Prompt: FE-004A2 Checkout Form Fields

Task: `FE-004A2` only. Add local checkout form fields to the existing checkout shell. Do not submit orders.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/05-BUSINESS-RULES.md`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`

Allowed files to modify:

- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`
- `ai_context/11-QWEN-REPORTS/fe-004a2-checkout-form-fields.md`

Forbidden changes:

- Do not modify `frontend/src/App.jsx`.
- Do not modify `frontend/src/api.js`.
- Do not modify backend files.
- Do not add dependencies.
- Do not add checkout API POST or any fetch call.
- Do not add delivery-zone fetching.
- Do not add document upload, document number, or ID image fields.

Implementation requirements:

- Add local React state inside `CheckoutView` for future checkout payload fields.
- Fields shown in the UI: full name, phone, optional email, address line, optional building details, city, optional delivery notes, scheduled date, scheduled time window, payment method, optional customer notes, terms accepted, age confirmed by customer.
- Keep local state keys aligned with future backend payload names: `customer.full_name`, `customer.phone`, `customer.email`, `address.address_line`, `address.building_details`, `address.city`, `address.delivery_notes`, `scheduled_date`, `scheduled_time_window`, `payment_method`, `customer_notes`, `terms_accepted`, and `age_confirmed_by_customer`.
- Payment method choices must be only `CASH`, `TRANSFER`, and `YAPPY_MANUAL`.
- Add a disabled or placeholder-only submit button.
- The button must not call the backend and must not submit a form to the browser.
- Keep the UI mobile-first and consistent with the existing dark glassmorphism style.

Command to run:

- From `frontend/`: `npm run build`

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004a2-checkout-form-fields.md`

Report must include:

- Summary.
- Files changed.
- Fields added.
- Build result.
- Confirm no API POST/fetch was added.

## Prompt: FE-004A3 Checkout Summary And Alcohol Flag

Task: `FE-004A3` only. Show checkout cart summary and store alcohol metadata on cart items. Do not submit orders.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `frontend/src/App.jsx`
- `frontend/src/components/ProductDetail.jsx`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`

Allowed files to modify:

- `frontend/src/components/ProductDetail.jsx`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`
- `ai_context/11-QWEN-REPORTS/fe-004a3-checkout-summary-alcohol-flag.md`

Forbidden changes:

- Do not modify backend files.
- Do not modify `frontend/src/api.js`.
- Do not add dependencies.
- Do not add checkout API POST or any fetch call.
- Do not add delivery-zone fetching.
- Do not add document upload, document number, or ID image fields.

Implementation requirements:

- In `ProductDetail.jsx`, add `isAlcoholic: Boolean(product.is_alcoholic)` to the cart item object passed to `onAddToCart`.
- In `CheckoutView.jsx`, compute whether any cart item has `isAlcoholic === true`.
- Show cart item summary in checkout: product name, optional variant name, quantity, and line total.
- Show subtotal, current flat delivery fee placeholder, and total.
- Show the age confirmation checkbox as required-looking only when the cart has alcoholic items.
- Keep the submit button disabled or placeholder-only. No backend calls.
- Preserve the existing styling direction.

Command to run:

- From `frontend/`: `npm run build`

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004a3-checkout-summary-alcohol-flag.md`

Report must include:

- Summary.
- Files changed.
- Alcohol metadata behavior.
- Build result.
- Confirm no API POST/fetch was added.

## Prompt: FE-004A4 Checkout Shell Docs

Task: `FE-004A4` only. Update docs and log for the completed checkout shell work. Do not change frontend behavior.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- Reports for `FE-004A1`, `FE-004A2`, and `FE-004A3`.
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-004a4-checkout-shell-docs.md`

Forbidden changes:

- Do not modify frontend source code.
- Do not modify backend files.
- Do not add dependencies.

Implementation requirements:

- Update `frontend/README.md` to document the checkout shell status.
- Update `ai_context/02-LOG.md` with a concise entry for `FE-004A1` through `FE-004A4`.
- Mention explicitly that checkout submission, delivery-zone fetching, and payment integrations are still not implemented.

Command to run:

- No build required unless source files were accidentally changed. If source files are changed, stop and report the mistake.

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004a4-checkout-shell-docs.md`

Report must include:

- Summary.
- Files changed.
- What remains for `FE-004B` and `FE-004C`.

## Prompt: FE-004B1 Delivery Zones API Helper

Task: `FE-004B1` only. Add the frontend API helper for public delivery zones. Do not change checkout UI yet.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `frontend/src/api.js`
- `backend/apps/delivery/views.py`
- `backend/apps/delivery/serializers.py`

Allowed files to modify:

- `frontend/src/api.js`
- `ai_context/11-QWEN-REPORTS/fe-004b1-delivery-zones-api-helper.md`

Forbidden changes:

- Do not modify backend files.
- Do not modify `frontend/src/App.jsx`.
- Do not modify `frontend/src/components/CheckoutView.jsx`.
- Do not modify styles.
- Do not add dependencies.
- Do not add checkout API POST.

Implementation requirements:

- Add `getPublicDeliveryZones(tenantSlug)` to `frontend/src/api.js`.
- It must call `apiGet(`/public/${tenantSlug}/delivery-zones/`)`.
- Do not change existing exports or behavior.
- Do not add fetch logic anywhere else.

Command to run:

- From `frontend/`: `npm run build`

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004b1-delivery-zones-api-helper.md`

Report must include:

- Summary.
- Files changed.
- API helper added.
- Build result.

## Prompt: FE-004B2 Delivery Zones Fetch States

Task: `FE-004B2` only. Fetch delivery zones in checkout and show loading/error/empty states. Do not calculate dynamic totals yet.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/05-BUSINESS-RULES.md`
- `frontend/src/api.js`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`

Allowed files to modify:

- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`
- `ai_context/11-QWEN-REPORTS/fe-004b2-delivery-zones-fetch-states.md`

Forbidden changes:

- Do not modify backend files.
- Do not modify `frontend/src/App.jsx`.
- Do not modify `frontend/src/api.js`.
- Do not add dependencies.
- Do not add checkout API POST.
- Do not change checkout totals yet.
- Do not add payment gateway or WhatsApp integration.

Implementation requirements:

- Import `getPublicDeliveryZones` in `CheckoutView.jsx`.
- Fetch active delivery zones for tenant slug `drinklivery-panama` when checkout renders and cart is not empty.
- Expect backend response shape `{ "zones": [...] }`.
- Add local state for zones, loading, error, and selected zone id.
- Show a delivery-zone section in checkout.
- Show loading state while zones load.
- Show readable error state with a retry button if loading fails.
- Show empty state if no zones are returned.
- Render selectable delivery zone cards with name, city, base fee, and minimum order amount if present.
- Default selected zone to the first returned zone when available.
- Keep existing flat delivery fee totals unchanged in this task.

Command to run:

- From `frontend/`: `npm run build`

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004b2-delivery-zones-fetch-states.md`

Report must include:

- Summary.
- Files changed.
- Loading/error/empty state behavior.
- Build result.
- Confirm checkout totals were not changed.

## Prompt: FE-004B3 Selected Zone Totals

Task: `FE-004B3` only. Use the selected delivery zone fee for checkout totals. Do not submit orders.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`

Allowed files to modify:

- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/styles.css`
- `ai_context/11-QWEN-REPORTS/fe-004b3-selected-zone-totals.md`

Forbidden changes:

- Do not modify backend files.
- Do not modify `frontend/src/api.js`.
- Do not modify `frontend/src/App.jsx`.
- Do not add dependencies.
- Do not add checkout API POST.
- Do not change cart view totals.

Implementation requirements:

- In `CheckoutView.jsx`, compute the selected zone from the loaded zones and selected zone id.
- Use selected zone `base_fee` as the checkout delivery fee.
- Use the existing `deliveryFee` prop only as a fallback when no selected zone exists.
- Update checkout total to `cartSubtotal + checkoutDeliveryFee`.
- Show selected zone fee in the summary.
- Keep submit disabled or placeholder-only.
- Do not make order creation calls.

Command to run:

- From `frontend/`: `npm run build`

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004b3-selected-zone-totals.md`

Report must include:

- Summary.
- Files changed.
- Total calculation behavior.
- Build result.
- Confirm no checkout POST/fetch beyond delivery zones was added.

## Prompt: FE-004B4 Delivery Zones Docs And Log

Task: `FE-004B4` only. Update docs and log for completed delivery-zone checkout totals. Do not change frontend behavior.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/11-QWEN-REPORTS/fe-004b1-delivery-zones-api-helper.md`
- `ai_context/11-QWEN-REPORTS/fe-004b2-delivery-zones-fetch-states.md`
- `ai_context/11-QWEN-REPORTS/fe-004b3-selected-zone-totals.md`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-004b4-delivery-zones-docs.md`

Forbidden changes:

- Do not modify frontend source code.
- Do not modify backend files.
- Do not add dependencies.
- Do not modify `package.json` or `package-lock.json`.

Implementation requirements:

- Update `frontend/README.md` to document delivery-zone fetching and selected-zone checkout totals.
- Update `ai_context/02-LOG.md` with concise entries for `FE-004B1` through `FE-004B4`.
- Mention explicitly that checkout submission and payment integrations are still not implemented.

Command to run:

- No build required unless source files were accidentally changed. If source files are changed, stop and report the mistake.

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004b4-delivery-zones-docs.md`

Report must include:

- Summary.
- Files changed.
- What remains for `FE-004C`.
- Confirmation that no frontend source or backend files were modified.

## Prompt: FE-004C1 Public Checkout API Helper

Task: `FE-004C1` only. Add the frontend POST helper for public checkout. Do not wire the checkout form yet.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `frontend/src/api.js`
- `backend/apps/orders/serializers.py`
- `backend/apps/orders/views.py`

Allowed files to modify:

- `frontend/src/api.js`
- `ai_context/11-QWEN-REPORTS/fe-004c1-public-checkout-api-helper.md`

Forbidden changes:

- Do not modify backend files.
- Do not modify `frontend/src/App.jsx`.
- Do not modify `frontend/src/components/CheckoutView.jsx`.
- Do not modify styles.
- Do not add dependencies.
- Do not add React Router.
- Do not add payment gateway or WhatsApp integration.
- Do not store document numbers, document images, or ID uploads.

Implementation requirements:

- Add `apiPost(path, payload)` to `frontend/src/api.js`.
- `apiPost` must build URLs the same way `apiGet` does, respecting `baseUrl` with or without trailing slash.
- `apiPost` must send JSON with `method: 'POST'` and `Content-Type: application/json`.
- `apiPost` must parse JSON responses when present.
- If the response is not ok, throw an `Error` with a readable message. Include backend `error` details when possible.
- Add `createPublicOrder(tenantSlug, payload)` to `frontend/src/api.js`.
- `createPublicOrder` must target `POST /public/{tenant_slug}/orders/`.
- Do not import or call `createPublicOrder` from checkout yet.
- Do not change existing API helper behavior.

Command to run:

- From `frontend/`: `npm run build`

Report file:

- `ai_context/11-QWEN-REPORTS/fe-004c1-public-checkout-api-helper.md`

Report must include:

- Summary.
- Files changed.
- API helper behavior.
- Error handling behavior.
- Build result.

## Prompt: FE-004D Checkout Review Cleanup

Task: `FE-004D` only. Review and harden the checkout flow after `FE-004A`, `FE-004B`, and `FE-004C` are complete.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- Reports for `FE-004A`, `FE-004B`, and `FE-004C`.
- `frontend/src/App.jsx`
- `frontend/src/api.js`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/components/OrderConfirmation.jsx`
- `frontend/src/styles.css`

Allowed files to modify:

- `frontend/src/App.jsx`
- `frontend/src/api.js`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/components/OrderConfirmation.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-004d-checkout-review-cleanup.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add admin UI.
- Do not add order tracking yet.
- Do not add external integrations.

Implementation requirements:

- Review the checkout flow for broken wiring, stale totals, missing disabled states, unreadable errors, and inconsistent labels.
- Ensure checkout cannot submit without delivery zone, cart items, terms acceptance, and required customer/address fields.
- Ensure alcoholic carts require age confirmation in frontend before hitting backend.
- Ensure checkout total matches selected delivery zone fee.
- Ensure successful checkout clears cart exactly once.
- Ensure no sensitive ID data fields are present.
- Keep copy aligned with legal drinking age and responsible delivery language.
- Update docs and report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Issues found.
- Fixes applied.
- Remaining risks.
- Build result.

## Prompt: FE-005A Public Order Tracking View

Task: `FE-005A` only. Add a public order tracking view using safe public order status endpoint.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `frontend/src/api.js`
- `frontend/src/App.jsx`
- `frontend/src/components/OrderConfirmation.jsx`
- `frontend/src/styles.css`
- `backend/apps/orders/views.py`

Note: there is no Stitch source folder in this repository. Use the existing
premium dark glassmorphism styling in `frontend/src/styles.css` as the design
source of truth.

Allowed files to modify:

- `frontend/src/api.js`
- `frontend/src/App.jsx`
- `frontend/src/components/OrderConfirmation.jsx`
- `frontend/src/components/OrderTracking.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-005a-public-order-tracking.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not expose customer data, address, payment reference, admin notes, compliance notes, or internal user data.
- Do not add admin UI.

Implementation requirements:

- Add `getPublicOrderStatus(tenantSlug, orderCode)` to `frontend/src/api.js`.
- Add `frontend/src/components/OrderTracking.jsx`.
- From `OrderConfirmation`, add a button to track the created order.
- `App.jsx` should switch to `view === 'tracking'` without adding a routing library.
- Tracking view fetches `GET /public/{tenant_slug}/orders/{order_code}/status/`.
- Show safe fields only: order code, status, scheduled date, scheduled time window, and total.
- Add loading, error, and not found states.
- Include a return-to-catalog action.
- Keep styling aligned with the dark glassmorphism design.
- Update docs and report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- Safe fields shown.
- Build result.

## Prompt: FE-006A Admin API Helpers

Task: `FE-006A` only. Add frontend API helpers for the existing admin read endpoints. Do not add admin UI yet.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `backend/apps/orders/views.py`
- `backend/apps/orders/urls.py`
- `frontend/src/api.js`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/api.js`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-006a-admin-api-helpers.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add admin UI yet.
- Do not add login UI, token storage, or auth flows.
- Do not add status update, payment update, delivery verification UI, product admin, charts, or external integrations.
- Do not add document number, document image, ID upload, or other sensitive ID collection fields.

Implementation requirements:

- Add `getAdminOrders()` to `frontend/src/api.js`, calling `GET /admin/orders/` through the existing API base URL.
- Add `getAdminOrder(id)` to `frontend/src/api.js`, calling `GET /admin/orders/{id}/`.
- Add `getAdminDashboardSummary()` to `frontend/src/api.js`, calling `GET /admin/dashboard/summary/`.
- Keep existing public helpers working.
- Preserve the current `apiGet` error behavior, including parsed backend error details and HTTP status on non-2xx responses.
- Update `frontend/README.md` to document the new admin helpers and note that they assume backend admin authentication already exists; no frontend auth flow is implemented.
- Update `ai_context/02-LOG.md`.
- Write the report at `ai_context/11-QWEN-REPORTS/fe-006a-admin-api-helpers.md`.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- Helper behavior.
- Explicit confirmation that no admin UI/auth flow/mutation endpoints were added.
- Build result.

## Prompt: FE-006B Admin Orders List Shell

Task: `FE-006B` only. Add a minimal admin orders list screen using the existing `getAdminOrders()` helper from FE-006A.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `frontend/src/api.js`
- `frontend/src/App.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/App.jsx`
- `frontend/src/components/AdminOrders.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-006b-admin-orders-list.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add login UI, token storage, or auth flows.
- Do not add order detail view yet.
- Do not add status update, payment update, delivery verification UI, product admin, charts, or external integrations.
- Do not add document number, document image, ID upload, or other sensitive ID collection fields.

Implementation requirements:

- Add `frontend/src/components/AdminOrders.jsx`.
- `AdminOrders` fetches `getAdminOrders()` on mount.
- Show loading, error, empty, and populated states.
- If backend returns 401/403, show a readable admin-auth-required style error. Do not implement auth.
- Display operational fields from the admin response only: order code, status, payment status, customer full name, city, total, scheduled date/window, and created date.
- Include a return-to-catalog action.
- Update `App.jsx` to switch to `view === 'admin-orders'` without React Router. Add a small dev/admin entry point using existing styling; keep it unobtrusive.
- Preserve public catalog/cart/checkout/tracking behavior.
- Style with existing dark glassmorphism language in `frontend/src/styles.css`.
- Update `frontend/README.md`, `ai_context/02-LOG.md`, and the report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- UX states.
- Auth assumption/no-auth-flow confirmation.
- Build result.

## Prompt: FE-006C Admin Order Detail View

Task: `FE-006C` only. Add admin order detail view using the existing `getAdminOrder(id)` helper.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `backend/apps/orders/views.py`
- `frontend/src/api.js`
- `frontend/src/App.jsx`
- `frontend/src/components/AdminOrders.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/App.jsx`
- `frontend/src/components/AdminOrders.jsx`
- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-006c-admin-order-detail.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add login UI, token storage, or auth flows.
- Do not add status update, payment update, delivery verification UI, product admin, charts, or external integrations.
- Do not add document number, document image, ID upload, or other sensitive ID collection fields.

Implementation requirements:

- Add `frontend/src/components/AdminOrderDetail.jsx`.
- Selecting an order from `AdminOrders` opens the detail view in `App.jsx` state.
- Detail view fetches `getAdminOrder(id)` and shows loading, error, not-found-style, and populated states.
- Show admin operational fields returned by `_serialize_admin_order`: order code, status, payment status/method, customer summary, address summary, subtotal, delivery fee, total, scheduled date/window, created date, and item summaries.
- Include back-to-list and return-to-catalog actions.
- Keep document number/image/upload fields out entirely.
- Update docs/log/report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- Displayed fields.
- Explicit no-sensitive-ID-fields confirmation.
- Build result.

## Prompt: FE-006D Admin Dashboard Summary

Task: `FE-006D` only. Add a small admin dashboard summary panel using `getAdminDashboardSummary()`.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `frontend/src/api.js`
- `frontend/src/components/AdminOrders.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/components/AdminOrders.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-006d-admin-dashboard-summary.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add login UI, token storage, or auth flows.
- Do not add status update, payment update, delivery verification UI, product admin, charts, or external integrations.

Implementation requirements:

- Fetch `getAdminDashboardSummary()` in the admin orders screen.
- Show total orders, pending orders, confirmed revenue, and orders by status.
- Include loading and error states for the summary panel without blocking the order list.
- Use simple dark glassmorphism cards; no charting library.
- Update docs/log/report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- Dashboard fields shown.
- Build result.

## Prompt: FE-007A Admin Mutation API Helpers

Task: `FE-007A` only. Add frontend API helpers for the existing admin mutation endpoints. Do not add UI yet.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `backend/apps/orders/views.py`
- `backend/apps/orders/urls.py`
- `frontend/src/api.js`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/api.js`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-007a-admin-mutation-api-helpers.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add any admin action UI yet.
- Do not add login UI, token storage, or auth flows.
- Do not add product admin, charts, or external integrations.
- Do not add document number, document image, ID upload, or other sensitive ID collection fields.

Implementation requirements:

- Add `apiPatch(path, payload)` to `frontend/src/api.js`.
- `apiPatch` must send JSON with method `PATCH`, parse JSON response, and throw readable errors on non-2xx.
- Preserve HTTP status on non-2xx errors (`error.status = res.status`) so later UI can detect 401/403/404.
- If needed, minimally improve `apiPost` error handling to also preserve `error.status`, without breaking existing checkout behavior.
- Add `updateAdminOrderStatus(id, payload)` calling `PATCH /admin/orders/{id}/status/`.
- Add `updateAdminOrderPayment(id, payload)` calling `PATCH /admin/orders/{id}/payment/`.
- Add `submitAdminDeliveryVerification(id, payload)` calling `POST /admin/orders/{id}/delivery-verification/`.
- Payload shapes must follow backend views:
  - status update: `{ status, note }`
  - payment update: `{ method, status, amount, reference, notes }`
  - delivery verification: `{ receiver_name, receiver_document_checked, receiver_is_adult, verification_notes }`
- Do not include or mention sending `document_number`, `document_image`, images, uploads, or document IDs.
- Update `frontend/README.md`, `ai_context/02-LOG.md`, and the report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- Helper behavior and endpoint mapping.
- Explicit no-UI/no-auth-flow/no-sensitive-ID-fields confirmation.
- Build result.

## Prompt: FE-007B Admin Status Update UI

Task: `FE-007B` only. Add admin order status update UI to the existing read-only admin order detail view.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `backend/apps/orders/views.py`
- `frontend/src/api.js`
- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-007b-admin-status-update-ui.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add login UI, token storage, or auth flows.
- Do not add payment update UI, delivery verification UI, product admin, charts, or external integrations.
- Do not add document number, document image, ID upload, or other sensitive ID collection fields.

Implementation requirements:

- Add a compact status update form to `AdminOrderDetail.jsx`.
- Valid statuses must match backend `Order.Status` choices currently used by the app: `PENDING`, `ACCEPTED`, `IN_PREPARATION`, `READY_FOR_DELIVERY`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `REJECTED`, `FAILED_AGE_VERIFICATION`.
- Form fields: status select and optional note textarea.
- Submit calls `updateAdminOrderStatus(order.id, { status, note })`.
- Show submitting, error, and success states.
- After success, refresh the order detail or update displayed status.
- Preserve existing read-only details.
- Update docs/log/report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- UX states.
- Build result.

## Prompt: FE-007C Admin Payment Update UI

Task: `FE-007C` only. Add manual payment update UI to the existing admin order detail view.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `backend/apps/orders/views.py`
- `frontend/src/api.js`
- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-007c-admin-payment-update-ui.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add login UI, token storage, or auth flows.
- Do not add status update UI changes beyond what already exists.
- Do not add delivery verification UI, product admin, charts, external payment gateway integration, or WhatsApp integration.
- Do not add document number, document image, ID upload, or other sensitive ID collection fields.

Implementation requirements:

- Add a compact manual payment form to `AdminOrderDetail.jsx`.
- Fields: method, status, amount, reference, notes.
- Method choices should align with current backend choices: `CASH`, `TRANSFER`, `YAPPY_MANUAL`, `OTHER_MANUAL`.
- Payment status choices should align with current backend choices: `PENDING`, `CONFIRMED`, `FAILED`, `REFUNDED`, `CANCELLED`.
- Submit calls `updateAdminOrderPayment(order.id, { method, status, amount, reference, notes })`.
- Show submitting, error, and success states.
- After success, refresh the order detail or update displayed payment status.
- This is manual recording only; do not add payment gateway behavior.
- Update docs/log/report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- UX states.
- Explicit no-payment-gateway confirmation.
- Build result.

## Prompt: FE-007D Admin Delivery Verification UI

Task: `FE-007D` only. Add delivery verification UI to the existing admin order detail view.

Read first:

- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `backend/apps/orders/views.py`
- `frontend/src/api.js`
- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`

Allowed files to modify:

- `frontend/src/components/AdminOrderDetail.jsx`
- `frontend/src/styles.css`
- `frontend/README.md`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/fe-007d-admin-delivery-verification-ui.md`

Forbidden changes:

- Do not modify backend files.
- Do not add dependencies.
- Do not add React Router.
- Do not add login UI, token storage, or auth flows.
- Do not add product admin, charts, external integrations, WhatsApp integration, or uploads.
- Never add `document_number`, `document_image`, ID upload, image upload, document ID, or any sensitive ID storage/collection field.

Implementation requirements:

- Add a compact delivery verification form to `AdminOrderDetail.jsx`.
- Fields only: receiver name, receiver document checked boolean, receiver is adult boolean, and verification notes.
- Submit calls `submitAdminDeliveryVerification(order.id, { receiver_name, receiver_document_checked, receiver_is_adult, verification_notes })`.
- Show submitting, error, and success states.
- After success, refresh the order detail or update displayed order status.
- Copy must clearly say the physical ID is checked at delivery but not stored.
- Update docs/log/report.

Command to run:

- From `frontend/`: `npm run build`

Report must include:

- Summary.
- Files changed.
- UX states.
- Explicit no-sensitive-ID-fields confirmation.
- Build result.
