# BE-015A: Admin Dashboard Summary Endpoint

## Goal
Add admin dashboard summary endpoint that returns aggregate order statistics.

## Endpoint
- **URL:** `GET /api/admin/dashboard/summary/`
- **Permission:** `IsAdminUser` only
- **Response fields:**
  - `total_orders` (int) - total count of all orders
  - `pending_orders` (int) - count of orders with status == PENDING
  - `orders_by_status` (dict) - count per status from Order.Status.choices
  - `confirmed_revenue` (str) - sum of Order.total where payment_status == CONFIRMED

## Tests (AdminDashboardSummaryAPITest)
1. Unauthenticated access rejected (403)
2. Non-admin access rejected (403)
3. Admin can retrieve summary (200 with all 4 fields present)
4. total_orders correct (3 orders -> 3)
5. pending_orders correct (2 pending + 1 accepted -> 2)
6. orders_by_status correct (PENDING=1, ACCEPTED=2)
7. confirmed_revenue correct (61.00 + 40.00 confirmed = 101.00)
8. confirmed_revenue zero when none confirmed ('0.00')
9. Empty database returns zeros

## Files modified
- `backend/apps/orders/urls.py` - added URL route
- `backend/apps/orders/views.py` - added `admin_dashboard_summary` view
- `backend/apps/orders/tests/test_admin_order_endpoints.py` - added AdminDashboardSummaryAPITest class

## Files updated
- `ai_context/02-LOG.md` - BE-015A entry

## Commands Run
- `python -m pytest apps/orders apps/payments apps/compliance -q`

## Result
- `122 passed`
