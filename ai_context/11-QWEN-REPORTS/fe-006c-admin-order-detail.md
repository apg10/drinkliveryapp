# FE-006C — Admin Order Detail View

## Summary

Added a read-only admin order detail view using the existing `getAdminOrder(id)` helper. Selecting an order in the admin orders list opens the detail screen through `App.jsx` state, without React Router.

## Files Changed

- `frontend/src/App.jsx` — added `AdminOrderDetail`, selected admin order state, and `admin-order-detail` view branch.
- `frontend/src/components/AdminOrders.jsx` — added `onOpenOrder` support and a `View details` action per order card.
- `frontend/src/components/AdminOrderDetail.jsx` — new read-only order detail component.
- `frontend/src/styles.css` — added admin detail styles and admin order detail button styles.
- `frontend/README.md` — documented FE-006C behavior and scope limits.
- `ai_context/02-LOG.md` — added FE-006C execution entry.
- `ai_context/11-QWEN-REPORTS/fe-006c-admin-order-detail.md` — this report.

## Displayed Fields

- `order_code`
- `status`
- `payment_status`
- `payment_method`
- `customer.full_name`
- `customer.phone`
- `customer.email`
- `address.address_line`
- `address.building_details`
- `address.city`
- `address.delivery_notes`
- `subtotal`
- `delivery_fee`
- `total`
- `scheduled_date`
- `scheduled_time_window`
- `created_at`
- `items[].product_name`
- `items[].variant_name`
- `items[].quantity`
- `items[].unit_price`
- `items[].total_price`

## UX States

- Loading: shows `Loading order detail...`.
- Error: shows readable backend/admin-auth errors and retry action.
- Not found: shows order-not-found copy and a back-to-list action.
- Populated: shows grouped status, customer, address, totals, and items panels.
- Navigation: includes back-to-list and return-to-catalog actions.

## Explicit Confirmations

- No backend files were modified.
- No dependencies were added.
- No React Router was added.
- No login UI, token storage, or auth flow was added.
- No status update, payment update, delivery verification UI, product admin, charts, or external integrations were added.
- No document number, document image, ID upload, or other sensitive ID collection fields were added.

## Build Result

`npm run build` from `frontend/` passed. Vite transformed 33 modules and completed without errors.
