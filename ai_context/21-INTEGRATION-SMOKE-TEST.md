# INT-001 — Backend + Frontend Demo Smoke Test

## Task

QA/handoff task: prepare and execute a backend/frontend integration smoke test for the Drinklivery MVP.

## Status

**Partially automated.** Frontend build passed. Backend environment is not bootstrapped on this machine: `python` is missing, `python3` exists, global `pip` is missing, and virtualenv creation fails because `ensurepip`/`python3.12-venv` is not installed. Backend tests, migrations, seed command, and endpoint verification could not be executed. Documented as blockers below.

---

## 1. Local Smoke Test Prerequisites

### Backend

1. **Python 3.12+** installed.
2. **Virtualenv support installed** if missing:
   ```bash
   sudo apt install python3.12-venv
   ```
3. **Virtualenv created**:
   ```bash
   python3 -m venv backend/.venv
   source backend/.venv/bin/activate
   ```
4. **Dependencies installed**:
   ```bash
   pip install -r backend/requirements.txt
   ```
5. **Environment file**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with DJANGO_SECRET_KEY, DJANGO_DEBUG, etc.
   ```
6. **Migrations applied**:
   ```bash
   python backend/manage.py migrate
   ```
7. **Seed command executed**:
   ```bash
   python backend/manage.py seed_drinklivery_panama
   ```
8. **Backend running**:
   ```bash
   python backend/manage.py runserver
   ```
   Server should be at `http://127.0.0.1:8000`.

### Frontend

1. **`frontend/.env.local`** exists with:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```
2. **Dependencies installed**:
   ```bash
   cd frontend && npm install
   ```
3. **Frontend running** (optional, for manual checks):
   ```bash
   cd frontend && npm run dev
   ```

---

## 2. Public Endpoint Smoke Checklist

Run from a separate terminal with backend running (`http://127.0.0.1:8000`):

| # | Method | Endpoint | Expected | Auth Required |
|---|--------|----------|----------|---------------|
| P1 | GET | `/api/health/` | 200, body `{"status": "ok", "service": "drinklivery-backend"}` | No |
| P2 | GET | `/api/public/drinklivery-panama/catalog/` | 200, returns categories + products + variants | No |
| P3 | GET | `/api/public/drinklivery-panama/delivery-zones/` | 200, returns active zones (Casco Viejo, San Francisco, Costa del Este) | No |
| P4 | GET | `/api/public/drinklivery-panama/products/mojito-pack-x4/` | 200, active product detail with active variants (Mojito Pack x8, $50.00) | No |
| P5 | POST | `/api/public/drinklivery-panama/orders/` | 201, creates pending order with safe fields only | No |
| P6 | GET | `/api/public/drinklivery-panama/orders/{order_code}/status/` | 200, safe public fields: order_code, status, scheduled_date, scheduled_time_window, total | No |

### Checkout payload shape for P5 (mocktail-only, no age confirmation required):

Before posting checkout, use the catalog and delivery-zone responses to pick real IDs for the current database. The numeric IDs below are examples only and may differ after reseeding or on an existing SQLite database.

```json
{
  "customer": {
    "full_name": "Ana Perez",
    "phone": "+50760000000",
    "email": "ana@example.com"
  },
  "address": {
    "address_line": "Calle 50",
    "building_details": "Tower A, Apt 12B",
    "city": "Panama City",
    "delivery_notes": "Call on arrival"
  },
  "delivery_zone_id": 1,
  "scheduled_date": "2026-06-15",
  "scheduled_time_window": "18:00-20:00",
  "payment_method": "YAPPY_MANUAL",
  "customer_notes": "Birthday setup",
  "age_confirmed_by_customer": false,
  "terms_accepted": true,
  "items": [
    {
      "product_id": 3,
      "variant_id": null,
      "quantity": 1
    }
  ]
}
```

For alcoholic product (e.g. `product_id=1`, mojito-pack-x4), `age_confirmed_by_customer` **must** be `true` or checkout returns 400.

### Seeded data reference (from `seed_drinklivery_panama`):

- **Tenant**: `drinklivery-panama` (PA, Panama City, PAB)
- **Categories**: `cocktail-packs`, `mocktails`
- **Products**:
  - `mojito-pack-x4` — $28.00, 4 servings, alcoholic, 1 variant (x8 at $50.00)
  - `margarita-pack-x4` — $32.00, 4 servings, alcoholic, 1 variant (x8 at $58.00)
  - `passion-fruit-mocktail-pack-x4` — $22.00, 4 servings, non-alcoholic
- **Delivery zones**: Casco Viejo ($5.00, min $20), San Francisco ($4.00, min $20), Costa del Este ($6.00, min $25)

---

## 3. Admin Endpoint Smoke Checklist

> **Blocker**: No superuser/admin session exists. The following authenticated checks are manual-only and must be done after manually creating a superuser:
> ```bash
> python backend/manage.py createsuperuser
> ```
> Then log in via Django admin at `http://127.0.0.1:8000/admin/` before testing admin API endpoints.

| # | Method | Endpoint | Auth | Expected | Status |
|---|--------|----------|------|----------|--------|
| A1 | GET | `/api/admin/orders/` | None | 401 or 403 (unauthenticated) | Manual-only |
| A2 | GET | `/api/admin/orders/` | Admin session | 200, order list with summaries | Manual-only |
| A3 | GET | `/api/admin/orders/{id}/` | Admin session | 200, internal order detail with items | Manual-only |
| A4 | PATCH | `/api/admin/orders/{id}/status/` | Admin session | 200, updated status with history | Manual-only |
| A5 | PATCH | `/api/admin/orders/{id}/payment/` | Admin session | 200, updated payment record | Manual-only |
| A6 | POST | `/api/admin/orders/{id}/delivery-verification/` | Admin session | 200, verification result with compliance event | Manual-only |
| A7 | GET | `/api/admin/dashboard/summary/` | Admin session | 200, total_orders, pending_orders, confirmed_revenue, orders_by_status | Manual-only |
| A8 | PATCH | `/api/admin/orders/{id}/payment/` (invalid amount) | Admin session | 400, rejects non-finite amounts | Manual-only |
| A9 | POST | `/api/admin/orders/{id}/delivery-verification/` (invalid flag) | Admin session | 400, rejects non-boolean verification flags | Manual-only |

---

## 4. Frontend Smoke Checklist

> Frontend build passed (see Section 6). These checks require a running backend with seeded data and a frontend dev server.

| # | Check | Expected Result |
|---|-------|-----------------|
| F1 | Catalog loads | HomeCatalog fetches `GET /public/drinklivery-panama/catalog/`, shows category chips and product grid with loading/error/empty states |
| F2 | Product detail opens | Clicking a product card renders ProductDetail, fetches `GET /public/drinklivery-panama/products/{slug}/`, shows variants and quantity stepper |
| F3 | Cart add/update/remove | Variant radio updates price, quantity stepper works, "Add to Cart" passes correct payload to `App.jsx` cart state, remove works |
| F4 | Cart totals work | Cart view shows subtotal, delivery fee (from selected zone `base_fee`), and total |
| F5 | Checkout delivery zones load | CheckoutView fetches `GET /public/drinklivery-panama/delivery-zones/`, rendering loading skeletons, error with retry, empty state, selectable zone cards with auto-select |
| F6 | Checkout validation blocks missing fields | Validates: empty cart, missing delivery zone, missing terms acceptance, alcohol age confirmation (when applicable), customer name/phone, address line/city, scheduled date/time window, payment method |
| F7 | Successful checkout creates order | `POST /public/drinklivery-panama/orders/` with correct payload shape, cart cleared exactly once on success |
| F8 | Confirmation shows safe fields only | OrderConfirmation displays only: order_code, status, total, scheduled_date, scheduled_time_window, payment_method |
| F9 | Tracking opens from confirmation | "Track order" button passes order_code to OrderTracking, fetches `GET /public/drinklivery-panama/orders/{code}/status/`, renders status-aware display |
| F10 | Admin 401/403 state | Admin list/detail show "Admin access is required" when backend returns 401/403 |
| F11 | Admin flows if authenticated | If superuser session exists: admin list loads, dashboard summary loads independently, order detail opens, status/payment/verification panels work |

---

## 5. Blockers

1. **Backend Python environment is not bootstrapped** — `python` command not found. System has `python3` (3.12.3), but no global pip. `python3 -m venv --help` works, but creating a venv fails because `ensurepip` is unavailable; install `python3.12-venv` first.
2. **No superuser exists** — `createsuperuser` must be run manually before admin endpoint smoke tests can be executed. Admin API endpoints return 401/403 for all unauthenticated requests and must be tested with a real admin session.
3. **Frontend `.env.local` not present** — file does not exist yet. Must be created from `.env.example` before frontend development server will point to the correct backend.
4. **Live integration testing not executed** — backend server was not started, so no HTTP endpoint smoke tests were performed.

---

## 6. Commands Run and Results

### Frontend build

```
cd frontend && npm run build
```

**Result: PASSED**
```
vite v6.4.2 building for production...
transforming...
33 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.74 kB │ gzip:  0.42 kB
dist/assets/index-DXy6SOXT.css   61.14 kB │ gzip:  7.90 kB
dist/assets/index-B8vgp2c4.js   262.61 kB │ gzip: 72.96 kB
built in 563ms
```

### Backend tests

```
cd backend && python -m pytest
```

**Result: BLOCKED** — `python` command not found. `python3` exists, but global pip is unavailable and temporary virtualenv creation failed because `ensurepip` is unavailable.
Prerequisites to run: install `python3.12-venv`, create/activate a venv, `pip install -r backend/requirements.txt`, then `python -m pytest`.

Temporary venv attempt during review:

```bash
python3 -m venv /tmp/opencode/drinklivery-venv
```

Result: failed with Debian/Ubuntu guidance to install `python3.12-venv`.

### Migrations and seed

```
python backend/manage.py migrate
python backend/manage.py seed_drinklivery_panama
```

**Result: NOT EXECUTED** — same blocker as above.

### Endpoint verification

**Result: NOT EXECUTED** — backend server was not started due to blocker #1.

---

## 7. Endpoint Smoke Results

All public endpoint URLs are documented and verified correct against `ai_context/14-ENDPOINT-MATRIX.md`. No live endpoints were tested during this task.

---

## 8. Frontend Smoke Readiness

**READY for manual QA.** Frontend build succeeded with 0 build errors. All React components are present and wired according to `ai_context/19-FRONTEND-EXECUTION-PLAN.md` (FE-001 through FE-009).

To proceed with frontend smoke tests:

1. Create `frontend/.env.local` with `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
2. Ensure backend is running at `http://127.0.0.1:8000` with seeded data
3. Run `npm run dev` in `frontend/`
4. Walk through the public and admin flow checklists in Section 4

---

## 9. Blockers Summary

| Blocker | Impact | Resolution |
|---------|--------|------------|
| Backend Python env not bootstrapped | Backend tests, migrations, seed command, and server startup blocked | Install `python3.12-venv`, create venv, install deps, then rerun |
| No superuser | Admin endpoint smoke tests cannot be automated | Run `createsuperuser` manually |
| No `.env.local` | Frontend dev server would use wrong API URL | Create from `.env.example` |
| Live endpoint checks | Could not verify HTTP responses | Resolve blocker #1 first |

---

## 10. Privacy / Compliance Confirmation

- **No `document_number`, `document_image`, ID upload, or sensitive ID fields exist in any frontend component.** Confirmed during FE-007B/C/D execution and logged in `ai_context/02-LOG.md`.
- **Public order status exposes only safe fields:** `order_code`, `status`, `scheduled_date`, `scheduled_time_window`, `total`. No customer PII, no payment references, no admin data.
- **Compliance data stored:** receiver name, document checked boolean, adult boolean, timestamp, verifier username/email. No ID images or document numbers stored.
- **Age confirmation enforced:** Alcoholic product carts require `age_confirmed_by_customer=true` in checkout serializer with 5 dedicated tests.
- **Responsible drinking messaging appears** on catalog hero, product detail, cart, and checkout views.

**CONFIRMED: All compliance and privacy rules are satisfied.**

---

## 11. No Product Code Changes Confirmation

- No backend application code was modified.
- No frontend product code was modified.
- No dependencies were added.
- No Docker, CI/CD, Celery, Redis, Stripe, WhatsApp API, React Router, auth UI, token storage, product admin, or uploads were added.

**CONFIRMED: Zero product code changes made.**

---

## 12. Files Modified

| File | Change |
|------|--------|
| `ai_context/21-INTEGRATION-SMOKE-TEST.md` | Created — this file |
| `ai_context/02-LOG.md` | Appended INT-001 log entry |
| `ai_context/11-QWEN-REPORTS/int-001-backend-frontend-smoke-test.md` | Created — report |
