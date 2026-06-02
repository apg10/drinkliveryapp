# Drinklivery Frontend

React + Vite frontend powered by the Stitch-derived premium glassmorphism design system.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** React 19
- **Build Tool:** Vite 6
- **CSS:** Plain CSS + CSS custom properties (no Tailwind, no CSS-in-JS)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` and configure:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Use `/api` only when the frontend is served behind a reverse proxy that forwards `/api` to the backend.

## API Client

`src/api.js` reads `VITE_API_BASE_URL` from `.env.local` (default `http://127.0.0.1:8000/api`) and exports:

- `apiGet(path)` — GET + JSON parse, throws parsed backend error details with status on non-2xx
- `apiPost(path, payload)` — POST + JSON body, throws on non-2xx
- `getPublicCatalog(tenantSlug)` — GET `/public/{tenant_slug}/catalog/`
- `getPublicProduct(tenantSlug, productSlug)` — GET `/public/{tenant_slug}/products/{product_slug}/`
- `getPublicDeliveryZones(tenantSlug)` — GET `/public/{tenant_slug}/delivery-zones/`
- `createPublicOrder(tenantSlug, payload)` — POST `/public/{tenant_slug}/orders/`
- `getPublicOrderStatus(tenantSlug, orderCode)` — GET `/public/{tenant_slug}/orders/{order_code}/status/`
- `getAdminOrders()` — GET `/admin/orders/` (assumes backend admin authentication already exists)
- `getAdminOrder(id)` — GET `/admin/orders/{id}/` (assumes backend admin authentication already exists)
- `getAdminDashboardSummary()` — GET `/admin/dashboard/summary/` (assumes backend admin authentication already exists)
- `apiPatch(path, payload)` — PATCH + JSON body, throws parsed backend error details with status on non-2xx
- `updateAdminOrderStatus(id, payload)` — PATCH `/admin/orders/{id}/status/`, payload: `{ status, note }`
- `updateAdminOrderPayment(id, payload)` — PATCH `/admin/orders/{id}/payment/`, payload: `{ method, status, amount, reference, notes }`
- `submitAdminDeliveryVerification(id, payload)` — POST `/admin/orders/{id}/delivery-verification/`, payload: `{ receiver_name, receiver_document_checked, receiver_is_adult, verification_notes }`

## Architecture

- `src/App.jsx` — root component, renders `HomeCatalog`, `ProductDetail`, cart, checkout, order confirmation, tracking, admin orders, and dev status line
- `src/api.js` — API client (`apiGet`, `apiPost`, `apiPatch`, public catalog/product/delivery-zone/order helpers, admin read helpers, admin mutation helpers)
- `src/main.jsx` — React entry point
- `src/styles.css` — global styles with CSS variables derived from the Stitch design system
  ([DESIGN.md](../../stitch_drinklivery_premium_cocktail_experience/premium_tropical_nightlife/DESIGN.md))
- `src/components/` — feature components

## Design System (derived from Stitch)

All design tokens live as CSS custom properties in `src/styles.css`:

- **Dark surface palette** — Navy `#0e1323` base with glassmorphism layers
- **Primary** — Sunset Orange `#ffb4a3` for CTAs & pricing
- **Secondary** — Lime Mint `#a0d757` for mocktail / refresh indicators
- **Tertiary** — Amber Glow `#eec058` for alcoholic tags
- **Fonts** — Space Grotesk (headlines) + Inter (body)
- **Radius** — `1.25rem` cards, `9999px` pills
- **Glow effects** — `rgba(255,107,74,0.3)` outer shadows

### Static MVP Scope

The current MVP implements the public shopping flow plus admin order operations:

- **Home Catalog** (FE-002A)
  - Hero section with brand headline and legal drinking age badge
  - Category chip filter (dynamic from API)
  - Product cards fetched from GET /api/public/{tenant_slug}/catalog/
  - Product display: name, description, base price, servings (if present), alcoholic/non-alcoholic badge
  - Product cards are clickable → navigates to product detail via state
  - Images from API (`image` field) or placeholder fallback
  - Sticky View Cart bar showing cart count and subtotal
  - Mobile-only bottom navigation (hidden on desktop)
  - Loading, error, and empty states for the catalog fetch
  - Sticky View Cart bar showing cart count items (cart state in App.jsx via useState)

- **Product Detail** (FE-002B)
  - Clicking a product card loads detail from GET /api/public/{tenant_slug}/products/{product_slug}/
  - Uses simple App.jsx component state (no routing library)
  - Shows: name, description, base price, servings, alcoholic/non-alcoholic badge, variants (if returned)
  - Variant radio selector: selects a variant and updates displayed price
  - Quantity stepper (add/subtract)
  - "Add to Cart" button (wired to cart state in App.jsx via onAddToCart prop)
  - Legal drinking age compliance notice
  - Mobile-first layout: stacked image + content; desktop splits side-by-side
  - Loading and error states for the detail fetch

- **Cart** (FE-003A)
  - Cart state managed in `App.jsx` via `useState([])` (in-memory only, no persistence)
  - Cart items: product name, variant (if any), unit price, quantity, line total, remove button
  - Cart view features:
    - Empty state with "Start shopping" CTA
    - Item cards with image/name/variant/price/qty controls/remove
    - Order summary: subtotal, delivery fee ($5.99 flat), total
    - Compliance notice (adult confirmation)
    - "Add more drinks" CTA (returns to catalog)
    - "Continue to checkout" button navigates to checkout view
  - Cart count badge on HomeCatalog sticky bar
  - Styled as glass panels following the Stitch "your_cart_mvp" design

- **Checkout** (FE-004A through FE-004D)
  - Checkout shell via FE-004A1 through FE-004A4 is complete: a checkout view reachable from the cart with customer, address, schedule, and payment form fields; cart summary with alcoholic item badges; and compliance checkboxes.
  - Delivery-zone fetching (FE-004B1 through FE-004B3) is complete: `CheckoutView.jsx` fetches active zones from `GET /public/drinklivery-panama/delivery-zones/`, renders loading (skeleton cards), error (message with retry), and empty states, and displays selectable zone cards (name, city, base fee, minimum order). The first returned zone is auto-selected.
  - Selected-zone checkout totals (FE-004B3) are computed: the checkout delivery fee uses the selected zone's `base_fee` when a zone is selected, and falls back to the existing `deliveryFee` prop when no zone is selected. Checkout total is `cartSubtotal + checkoutDeliveryFee` (rounded to 2 decimals). A "(Zone Name)" label appears after "Delivery fee" when a zone is selected.
  - Checkout submit (FE-004C1 through FE-004C3) is connected: `createPublicOrder` calls `POST /public/{tenant_slug}/orders/`. Frontend validation covers empty cart, missing delivery zone, missing terms acceptance, alcoholic age confirmation, customer name/phone, address line/city, scheduled date/time window, and payment method. Submit button is disabled while loading or when conditions are not met. On success, cart is cleared exactly once and the `OrderConfirmation` view is shown. The OrderConfirmation view displays only safe order summary fields: order_code, status, total, scheduled_date, scheduled_time_window, payment_method. Order tracking (FE-005A) adds a tracking button and `OrderTracking` view.
  - Payment gateway integration is not implemented.
  - WhatsApp integration is not implemented.
  - Admin UI is handled separately in the FE-006 block.
- **Admin API Helpers** (FE-006A) — `getAdminOrders()`, `getAdminOrder(id)`, and `getAdminDashboardSummary()` added to `api.js` for the existing admin read endpoints. These assume backend admin authentication already exists; no frontend auth flow is implemented.

- **Admin Orders List** (FE-006B)
  - Adds `AdminOrders.jsx`, reachable from a small dev/admin entry point without React Router.
  - Fetches `getAdminOrders()` and renders loading, error, empty, and populated states.
  - Displays operational order fields: order code, status, payment status, customer full name, city, total, scheduled date/window, and created date.
  - If the backend returns 401/403, the view shows a readable admin-access-required message. No login UI, token storage, order detail, mutations, product admin, or charting library is implemented.

- **Admin Order Detail** (FE-006C)
  - Adds `AdminOrderDetail.jsx`, opened from the admin orders list via App state.
  - Fetches `getAdminOrder(id)` and renders loading, error, not-found, and populated states.
  - Displays admin operational fields returned by the backend: status/payment data, customer summary, address summary, totals, scheduled fields, created date, and item summaries.
  - Still read-only: no status updates, payment updates, delivery verification UI, frontend auth flow, token storage, product admin, or sensitive ID/document fields.

- **Admin Dashboard Summary** (FE-006D)
  - Adds a dashboard summary panel to `AdminOrders.jsx` using `getAdminDashboardSummary()`.
  - Shows total orders, pending orders, confirmed revenue, and orders by status with simple glass cards/chips.
  - Summary loading/error states do not block the orders list. No charting library or new dependency is used.

- **Admin Mutation API Helpers** (FE-007A)
  - `apiPatch(path, payload)` added — sends JSON with method PATCH, parses JSON response, throws readable errors on non-2xx with `error.status` preserved.
  - `apiPost` minimally improved to preserve `error.status` on non-2xx responses without breaking checkout behavior.
  - `updateAdminOrderStatus(id, payload)` — PATCH `/admin/orders/{id}/status/`, payload shape: `{ status, note }`.
  - `updateAdminOrderPayment(id, payload)` — PATCH `/admin/orders/{id}/payment/`, payload shape: `{ method, status, amount, reference, notes }`.
  - `submitAdminDeliveryVerification(id, payload)` — POST `/admin/orders/{id}/delivery-verification/`, payload shape: `{ receiver_name, receiver_document_checked, receiver_is_adult, verification_notes }`.
  - No admin action UI, login UI, token storage, auth flows, product admin, charts, external integrations, document_number, document_image, ID upload, image upload, or other sensitive ID collection/storage fields added.

- **Admin Action UI Block** (FE-007B + FE-007C + FE-007D)
  - Three compact admin action panels added inside `AdminOrderDetail.jsx` (after the read-only detail sections):
    - **Update Status** — select with backend order statuses PENDING, ACCEPTED, IN_PREPARATION, READY_FOR_DELIVERY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REJECTED, FAILED_AGE_VERIFICATION plus optional note textarea. Submits via `updateAdminOrderStatus()`, shows submitting/error/success states, refreshes order detail on success.
    - **Record Payment** — method selector (CASH, TRANSFER, YAPPY_MANUAL, OTHER_MANUAL), payment status selector (PENDING, CONFIRMED, FAILED, REFUNDED, CANCELLED), required amount, reference, and notes fields. Submits via `updateAdminOrderPayment()`, shows submitting/error/success states, refreshes order detail on success. Manual recording only — no payment gateway integration.
    - **Delivery Verification** — receiver name input, document checked boolean, adult boolean, and verification notes textarea. Includes compliance notice: "Physical ID is checked at delivery but not stored. Do not enter ID numbers or upload images." Submits via `submitAdminDeliveryVerification()`, shows submitting/error/success states, refreshes order detail on success.
  - All panels use the dark glassmorphism style from `styles.css` with `admin-action-*` CSS classes. Each panel is independent — failure in one does not break the detail page.
  - No document_number, document_image, ID upload, image upload, document ID, or any sensitive ID collection/storage fields.
  - `npm run build` passed. Report at `ai_context/11-QWEN-REPORTS/fe-007b-007c-007d-admin-action-ui-block.md`.

## FE-008 Hardening (2026-06-01)

- **Checkout payment options aligned with backend**: `CheckoutView.jsx` now includes `OTHER_MANUAL` in the `PAYMENT_OPTIONS` array, matching the backend payment method enum (CASH, TRANSFER, YAPPY_MANUAL, OTHER_MANUAL). Previously only CASH, TRANSFER, and YAPPY_MANUAL were available.
- No other code changes were needed. All areas reviewed below passed their respective checks.
- `npm run build` passed (601ms).

## Demo / Staging QA

### Required Local Prerequisites

- Backend running (`python backend/manage.py runserver`)
- Frontend dependencies installed (`npm install` or `npm ci` in `frontend/`)
- Seeded tenant and data (`python backend/manage.py seed_drinklivery_panama`)
- `VITE_API_BASE_URL` configured in `frontend/.env.local` pointing to the backend API base URL

### Commands

```bash
cd frontend/

# Install dependencies
npm install          # or npm ci

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Public Flow Checklist

| # | Check | Expected Result |
|---|-------|-----------------|
| 1 | Catalog loads | HomeCatalog fetches `GET /public/drinklivery-panama/catalog/`, shows category chips and product grid with loading/error/empty states |
| 2 | Product detail opens | Clicking a product card renders `ProductDetail` via App state, fetches `GET /public/drinklivery-panama/products/{slug}/`, shows variants and quantity stepper |
| 3 | Variant/quantity add to cart works | Variant radio updates price, quantity stepper works, "Add to Cart" passes `{ key, productId, variantId, name, variantName, price, quantity, imageUrl, isAlcoholic }` to `App.jsx` cart state |
| 4 | Cart totals work | Cart view shows subtotal, delivery fee (from selected zone `base_fee` or $5.99 fallback), and total. Quantity controls and remove work correctly |
| 5 | Checkout delivery zones load | `CheckoutView` fetches `GET /public/drinklivery-panama/delivery-zones/`, renders loading skeletons, error with retry, empty state, selectable zone cards with auto-select on first zone |
| 6 | Checkout validation blocks missing fields | Validates: empty cart, missing delivery zone, missing terms acceptance, alcohol age confirmation (when applicable), customer name, phone, address line, city, scheduled date, time window, payment method |
| 7 | Successful checkout creates order | `POST /public/drinklivery-panama/orders/` with correct payload shape. Cart cleared exactly once on success |
| 8 | Confirmation shows safe fields only | `OrderConfirmation` displays `order_code`, `status`, `total`, `scheduled_date`, `scheduled_time_window`, `payment_method` only. No customer PII leaked |
| 9 | Tracking opens from confirmation | "Track order" button in confirmation passes `order_code` to `OrderTracking`, which fetches `GET /public/drinklivery-panama/orders/{code}/status/` and renders status-aware display with loading/error/not found states |

### Admin Flow Checklist

| # | Check | Expected Result |
|---|-------|-----------------|
| 1 | Admin entry opens orders view | Clicking "Admin" button in bottom app bar sets `view: 'admin-orders'`, renders `AdminOrders` |
| 2 | 401/403 shows readable admin access message if not authenticated | Admin list and detail show "Admin access is required" when backend returns 401/403 |
| 3 | Orders list loads when authenticated | `getAdminOrders()` fetches `GET /admin/orders/`, renders populated order cards with code/status/payment/customer/city/total/scheduled/created |
| 4 | Dashboard summary loads independently | `AdminOrders` fetches `GET /admin/dashboard/summary/` independently. Loading/error states do not block order list |
| 5 | Order detail opens | Clicking "View details" sets `view: 'admin-order-detail'`, passes `orderId`, `AdminOrderDetail` fetches `GET /admin/orders/{id}/` |
| 6 | Status update form works | Admin selects status from backend enum (PENDING, ACCEPTED, IN_PREPARATION, READY_FOR_DELIVERY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REJECTED, FAILED_AGE_VERIFICATION) + optional note, submits via `PATCH /admin/orders/{id}/status/`, shows submitting/error/success, refreshes detail on success |
| 7 | Payment record form works | Admin selects method (CASH, TRANSFER, YAPPY_MANUAL, OTHER_MANUAL), payment status (PENDING, CONFIRMED, FAILED, REFUNDED, CANCELLED), enters required amount, optional reference/notes, submits via `PATCH /admin/orders/{id}/payment/`, shows submitting/error/success, refreshes detail on success |
| 8 | Delivery verification form works | Admin enters required receiver name, selects document checked (yes/no), receiver is adult (yes/no), optional notes, submits via `POST /admin/orders/{id}/delivery-verification/`, shows compliance notice, submitting/error/success, refreshes detail on success |

### Privacy / Compliance Checklist

| # | Check | Result |
|---|-------|--------|
| 1 | No `document_number` field | No `document_number` in any component |
| 2 | No `document_image` field | No `document_image` or file input in any component |
| 3 | No ID upload | No `<input type="file">` or upload integration in any component |
| 4 | No customer address/phone in public tracking | `OrderTracking` shows only: order_code, status, scheduled_date, scheduled_time_window, total |
| 5 | Physical ID checked at delivery, not stored | Delivery verification form only captures receiver name, document checked boolean, adult boolean, notes. Copy states: "Physical ID is checked at delivery but not stored. Do not enter ID numbers or upload images." |
| 6 | Age confirmation enforced at checkout | `age_confirmed_by_customer` required checkbox for alcoholic carts before submit allowed |
| 7 | Responsible drinking messaging present | Appears on catalog hero, product detail, cart, and checkout views |

### Known MVP Limitations

- **No React Router:** View switching uses `App.jsx` `useState` state. Browser back/forward does not restore views.
- **In-memory cart only:** Cart is not persisted. Navigating away or refreshing the browser loses cart items.
- **No login UI:** Admin access depends entirely on the backend session. The "Admin" button in the bottom app bar is development-only. No token storage or auth flow is implemented.
- **No product admin:** Product CRUD is not implemented. Only the admin read endpoints for orders and dashboard are present.
- **No payment gateway:** Only manual payment methods (CASH, TRANSFER, YAPPY_MANUAL, OTHER_MANUAL) are supported for the MVP.
- **No WhatsApp API integration:** Notifications are out of scope for the MVP.
- **No charting/analytics library:** Admin dashboard uses simple CSS cards, not charts.
- **`DELIVERY_FEE` flat fallback:** `App.jsx` uses $5.99 as a flat fee fallback when no delivery zones exist. Delivery zone data should be seeded for staging/demo.
- **Admin auth depends on backend session:** The frontend makes no auth headers or token management. Admin endpoints require the backend session to already be authenticated.
- **Stitch source folder not in repository:** Design relies on `frontend/src/styles.css` as the source of truth, not on external Stitch files.

## Notes

- No Tailwind or Material Symbols CDN
- FE-001B: api client added (`src/api.js`), app shows dev status line with base URL
- FE-002A: catalog fetched via `getPublicCatalog("drinklivery-panama")` in HomeCatalog component
