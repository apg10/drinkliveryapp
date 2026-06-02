# INT-002B Report: Admin Endpoint Smoke Tests A1-A9

## Summary

INT-002B ran live admin endpoint smoke checks A1-A9 after INT-002A verified the backend env, migrations, seed, and public endpoints. **All 9 admin smoke checks PASSED.** A local demo superuser was created programmatically. Admin auth uses Django session (via `django.contrib.sessions` + DRF SessionAuthentication — all `@permission_classes([IsAdminUser])` views). GET requests work with session cookies from admin-login; PATCH/POST require both session cookie and `X-CSRFToken` header for CSRF-protected views.

## Files Changed

| File | Change |
|--|-|
| `ai_context/21-INTEGRATION-SMOKE-TEST.md` | Updated current status, admin smoke results, blockers, and INT-002B summary |
| `ai_context/02-LOG.md` | Appended INT-002B log entry |
| `ai_context/11-QWEN-REPORTS/int-002b-admin-smoke.md` | Created — this report |

**Confirmation: Zero product code changes.** No backend app code, frontend product code, or dependencies were modified. Only allowed documentation files updated.

## Admin Auth Method Used

**Django session authentication** (not DRF Token/Bearer).

1. Local demo superuser created programmatically. Credentials were used only for local smoke testing and are intentionally not recorded here:
   ```bash
   source backend/.venv/bin/activate
   cd backend
   export DJANGO_SETTINGS_MODULE=config.settings
   python manage.py createsuperuser
   ```

2. Login via Django admin:
   ```bash
   # Get CSRF token from the login page HTML
   LOGIN_HTML=$(curl -s -c /tmp/cookies.txt http://127.0.0.1:8000/admin/login/)
   CSRF=$(printf '%s' "$LOGIN_HTML" | grep -oP 'name="csrfmiddlewaretoken" value="\K[^"]+' | head -1)

   # POST login
   curl -s -b /tmp/cookies.txt -c /tmp/cookies.txt -X POST \
     http://127.0.0.1:8000/admin/login/ \
      -H "X-CSRFToken: $CSRF" \
      -d "username=<local-admin-user>&password=<local-admin-password>&next=/admin/" \
     -L > /dev/null

   # Re-fetch CSRF token (it rotates after login)
   CSRF=$(curl -s -b /tmp/cookies.txt http://127.0.0.1:8000/admin/ | grep -oP 'name="csrfmiddlewaretoken" value="\K[^"]+' | head -1)

   # Now session is authenticated — use with -b /tmp/cookies.txt -H "X-CSRFToken: $CSRF"
   ```

**Manual login steps:** Open `http://127.0.0.1:8000/admin/` in a browser, log in with the local demo superuser created for the smoke test. Session cookie will be set automatically. Use that browser session or extract cookies for curl.

## Commands Run

### Server startup
```bash
cd /home/adrian10/Projects/drinkliveryapp
source backend/.venv/bin/activate
python backend/manage.py runserver 127.0.0.1:8000 --noreload &
```

### A1: Unauthenticated admin access
```bash
curl -s -w "\nHTTP_CODE:%{http_code}\n" http://127.0.0.1:8000/api/admin/orders/
```

### A3: Admin order detail (with session cookie)
```bash
curl -s -b /tmp/cookies.txt http://127.0.0.1:8000/api/admin/orders/1/
```

### A4: Status update (PATCH + CSRF)
```bash
CSRF=$(curl -s -b /tmp/cookies.txt http://127.0.0.1:8000/admin/ | grep -oP 'name="csrfmiddlewaretoken" value="\K[^"]+' | head -1)
curl -s -b /tmp/cookies.txt -X PATCH \
  http://127.0.0.1:8000/api/admin/orders/1/status/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF" \
  -d '{"status": "ACCEPTED", "note": "Smoke test A4"}'
```

### A5: Payment update (PATCH + CSRF)
```bash
curl -s -b /tmp/cookies.txt -X PATCH \
  http://127.0.0.1:8000/api/admin/orders/1/payment/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF" \
  -d '{"method": "YAPPY_MANUAL", "status": "CONFIRMED", "amount": "49.00", "reference": "SMOKE-A5", "notes": "Smoke"}'
```

### A6: Delivery verification (POST + CSRF)
```bash
curl -s -b /tmp/cookies.txt -X POST \
  http://127.0.0.1:8000/api/admin/orders/1/delivery-verification/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF" \
  -d '{"receiver_name": "Juan Delivered", "receiver_document_checked": true, "receiver_is_adult": true, "verification_notes": "Smoke A6"}'
```

### A7: Dashboard summary
```bash
curl -s -b /tmp/cookies.txt http://127.0.0.1:8000/api/admin/dashboard/summary/
```

### A8: Invalid payment amount
```bash
curl -s -b /tmp/cookies.txt -X PATCH \
  http://127.0.0.1:8000/api/admin/orders/1/payment/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF" \
  -d '{"method": "CASH", "status": "CONFIRMED", "amount": "NaN"}'
```

### A9: Invalid delivery verification flags
```bash
curl -s -b /tmp/cookies.txt -X POST \
  http://127.0.0.1:8000/api/admin/orders/1/delivery-verification/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: $CSRF" \
  -d '{"receiver_name": "Juan", "receiver_document_checked": "yes", "receiver_is_adult": "true", "verification_notes": "Smoke"}'
```

### A2: Order list (with session cookie, GET only)
```bash
curl -s -b /tmp/cookies.txt http://127.0.0.1:8000/api/admin/orders/
```

## A1-A9 Results

| # | Method | Endpoint | Expected | Actual HTTP | Status | Actual Result |
|---|---|---|---|---|---|---|
| **A1** | GET | `/api/admin/orders/` (no auth) | 401 or 403 | **403** | **PASSED** | `{"detail":"Authentication credentials were not provided."}` |
| **A2** | GET | `/api/admin/orders/` (admin) | 200, order list | **200** | **PASSED** | `{"orders":[...], "count":2}` — 2 orders returned (ORD-A8B4FDCA, ORD-E5B9C2CA) with summaries, customer, address, items |
| **A3** | GET | `/api/admin/orders/1/` (admin) | 200, order detail | **200** | **PASSED** | Full order detail with id=1, order_code=ORD-A8B4FDCA, status=PENDING, payment_status=PENDING, customer/payload, 1 item |
| **A4** | PATCH | `/api/admin/orders/1/status/` (admin) | 200, updated status | **200** | **PASSED** | `{"id":1, "order_code":"ORD-A8B4FDCA", "status":"ACCEPTED"}` |
| **A5** | PATCH | `/api/admin/orders/1/payment/` (admin) | 200, payment record | **200** | **PASSED** | `{"id":1, "order_code":"ORD-A8B4FDCA", "payment_status":"CONFIRMED", "payment_record_id":1}` |
| **A6** | POST | `/api/admin/orders/1/delivery-verification/` (admin) | 200, verification result | **200** | **PASSED** | `{"order_id":1, "order_code":"ORD-A8B4FDCA", "status":"DELIVERED", "delivery_verification_id":1}` |
| **A7** | GET | `/api/admin/dashboard/summary/` (admin) | 200, summary metrics | **200** | **PASSED** | `{"total_orders":2, "pending_orders":1, "orders_by_status":{"PENDING":1,"DELIVERED":1,...}, "confirmed_revenue":"49"}` |
| **A8** | PATCH | `/api/admin/orders/1/payment/` (invalid amount) | 400, reject | **400** | **PASSED** | `{"error":"amount must be a valid decimal value."}` |
| **A9** | POST | `/api/admin/orders/1/delivery-verification/` (invalid flags) | 400, reject | **400** | **PASSED** | `{"error":"receiver_document_checked and receiver_is_adult must be booleans."}` |

**All 9 admin smoke checks: PASSED.**

## Order IDs/Codes Used

| Source | Order ID | Order Code | Notes |
|---|---|---|---|
| INT-002A (mocktail checkout) | 1 | ORD-A8B4FDCA | Customer: Ana Perez, product: Passion Fruit Mocktail Pack x4 (2x), total: $49.00. Used for A2-A6, A8, A9. |
| INT-002A (alcoholic checkout) | 2 | ORD-E5B9C2CA | Customer: Zoe Ruiz, product: Mojito Pack x4, total: $32.00. Referenced in A2. |

## Public Data Exposure Verification (Step 9)

### Verified no leaks in public endpoints:

1. **GET `/api/public/drinklivery-panama/orders/ORD-A8B4FDCA/status/`** returns only: `order_code`, `status`, `scheduled_date`, `scheduled_time_window`, `total`. **No** `payment_reference`, `payment_status`, `payment_method`, `customer` PII, `address`, `compliance_notes`, `verifier`, `document_number`, `document_image` fields.

2. **GET `/api/public/drinklivery-panama/catalog/`** — categories and products contain only: `id`, `name`, `slug`, `description`, `image`, `display_order`, `is_active`, `base_price`, `servings`, `is_alcoholic`, `alcohol_percentage_note`. No sensitive fields in products or variants.

3. **POST `/api/public/drinklivery-panama/orders/`** response (verified from `views.py:52-73`): `order_code`, `status`, `subtotal`, `delivery_fee`, `total`, `customer` (full_name/phone/email), `address` (address_line/building_details/city/delivery_notes), `scheduled_date`, `scheduled_time_window`, `payment_method`, `items_count`. This returns the submitted customer/address data to the caller that created the order. It does **not** include `payment_reference`, `document_number`, `document_image`, `compliance_notes`, or `verifier` fields. Public tracking remains safe-field-only.

4. Admin endpoints require `IsAdminUser` DRF permission (verified A1 returns 403 without auth).

**CONFIRMED: Public tracking does not expose payment reference, address PII, compliance notes, verifier info, admin data, or sensitive ID fields. Public checkout returns the submitted customer/address data in the immediate 201 response only.**

## Notes / Remaining Work

| Note | Impact | Resolution |
|---|---|---|
| Admin PATCH/POST requires CSRF token | Automated curl tests need CSRF token rotation flow (see "Admin Auth Method" section) | Use browser login at `http://127.0.0.1:8000/admin/` or script CSRF token extraction as documented |
| Frontend admin UI has no auth flow | Frontend components rely on an existing backend admin session and will get 403 without one | Out of scope — admin login UI is explicitly out of scope for MVP |

## Privacy/Compliance Confirmation

- **No `document_number`, `document_image`, ID upload, or sensitive ID fields** exist in any backend model or frontend component. Confirmed consistently across INT-001 through INT-002B.
- **Public order status** (`GET /public/{tenant_slug}/orders/{order_code}/status/`) returns only safe fields: `order_code`, `status`, `scheduled_date`, `scheduled_time_window`, `total`. No customer PII, no payment references, no internal data.
- **Age confirmation enforced**: Alcoholic product checkout requires `age_confirmed_by_customer=true` (400 when false). Mocktail-only orders bypass correctly.
- **Delivery verification** stores only: `receiver_name`, `receiver_document_checked`, `receiver_is_adult`, timestamp, `verified_by` (username/email). No ID images or document numbers.
- **Admin payment records** (payment_reference, notes) accessible only via admin-authenticated endpoints (`IsAdminUser`).
- **Responsible drinking messaging** present on catalog hero, product detail, cart, and checkout views.
- Admin views return customer/address PII only to authenticated admins — consistent with business requirements for order fulfillment.

**CONFIRMED: All privacy and compliance rules are satisfied.**

## No Product Code Changes Confirmation

- **No backend application code modified.** Views, serializers, models, URLs, tests unchanged.
- **No frontend product code modified.** All admin UI components, checkout, and catalog unchanged.
- **No dependencies added.** Only existing packages used.
- **No generated product code** — only `backend/.venv/`, `backend/.env`, `frontend/.env.local`, and documentation files created previously.

**CONFIRMED: Zero product code changes made.**

## INT-002B Results Summary Table

| Check | Expected | Result |
|---|---|---|
| Backend env (venv+deps) | Ready | Already from INT-002A |
| Migrations | Current | Already from INT-002A |
| Seed | Current | Already from INT-002A |
| Superuser | Created | Local demo admin user; credentials not recorded in docs |
| Server | Running | `127.0.0.1:8000` |
| **A1** Unauthenticated admin | 403 | **403** PASSED |
| **A2** Order list | 200, count=2 | **200** PASSED |
| **A3** Order detail | 200, has items | **200** PASSED |
| **A4** Status update | 200, ACCEPTED | **200** PASSED |
| **A5** Payment update | 200, CONFIRMED | **200** PASSED |
| **A6** Delivery verification | 200, DELIVERED | **200** PASSED |
| **A7** Dashboard summary | 200, metrics | **200** PASSED |
| **A8** Invalid payment amount | 400 | **400** PASSED |
| **A9** Invalid bool flags | 400 | **400** PASSED |
| P9a Public status fields | Safe only | Confirmed PASSED |
| P9b Public checkout fields | No internal/sensitive leaks | Confirmed PASSED (via views.py) |
| P9d Public catalog fields | No sensitive leaks | Confirmed PASSED |

**OVERALL: INT-002B ALL CHECKS PASSED.**
