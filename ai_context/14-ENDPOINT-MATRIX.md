# Endpoint Matrix

## Public Endpoints

| Method | Endpoint | Auth | App | Milestone | Request Summary | Response Summary |
|---|---|---|---|---|---|---|
| GET | `/api/health/` | None | `core` | BE-001 | None | Service health status |
| GET | `/api/public/{tenant_slug}/catalog/` | None | `products` | BE-004 | Tenant slug | Active categories, products, variants |
| GET | `/api/public/{tenant_slug}/products/{product_slug}/` | None | `products` | BE-005 | Tenant slug and product slug | Active product detail with active variants |
| GET | `/api/public/{tenant_slug}/delivery-zones/` | None | `delivery` | BE-006 | Tenant slug | Active delivery zones |
| POST | `/api/public/{tenant_slug}/orders/` | None | `orders` | BE-008/BE-009A/BE-009B | Customer, address, schedule, zone, items, payment method, age/terms flags | Created pending order summary |
| GET | `/api/public/{tenant_slug}/orders/{order_code}/status/` | None | `orders` | BE-011A | Tenant slug and order code | Safe public order status |

## Admin Endpoints

| Method | Endpoint | Auth | App | Milestone | Request Summary | Response Summary |
|---|---|---|---|---|---|---|
| GET | `/api/admin/orders/` | Admin | `orders` | BE-014A | Filters later | Order list |
| GET | `/api/admin/orders/{id}/` | Admin | `orders` | BE-014A | Order id | Internal order detail |
| PATCH | `/api/admin/orders/{id}/status/` | Admin | `orders` | BE-014B | New status, note | Updated order status |
| PATCH | `/api/admin/orders/{id}/payment/` | Admin | `payments` | BE-014C | Method, status, amount, reference, notes | Updated payment/order payment status |
| POST | `/api/admin/orders/{id}/delivery-verification/` | Admin | `compliance` | BE-014D | Receiver verification data | Delivery verification result |
| GET | `/api/admin/products/` | Admin | `products` | Future | Filters later | Product list |
| POST | `/api/admin/products/` | Admin | `products` | Future | Product fields | Created product |
| PATCH | `/api/admin/products/{id}/` | Admin | `products` | Future | Product changes | Updated product |
| GET | `/api/admin/dashboard/summary/` | Admin | `orders` | BE-015A | Optional date filters | Summary metrics |

## Checkout Request Draft

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
  "age_confirmed_by_customer": true,
  "terms_accepted": true,
  "items": [
    {
      "product_id": 1,
      "variant_id": 2,
      "quantity": 1
    }
  ]
}
```

## Public Order Status Response Draft

```json
{
  "order_code": "DLV-ABC123",
  "status": "ACCEPTED",
  "scheduled_date": "2026-06-15",
  "scheduled_time_window": "18:00-20:00",
  "total": "42.00"
}
```

Public status must not expose internal notes, compliance notes, payment references, or admin user data.
