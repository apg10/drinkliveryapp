# Endpoint Matrix

## Public Endpoints

| Method | Endpoint | Auth | App | Milestone | Request Summary | Response Summary |
|---|---|---|---|---|---|---|
| GET | `/api/health/` | None | `core` | BE-001 | None | Service health status |
| GET | `/api/public/{tenant_slug}/catalog/` | None | `products` | BE-004 | Tenant slug | Active categories, products, variants |
| GET | `/api/public/{tenant_slug}/products/{product_slug}/` | None | `products` | BE-005 | Tenant slug and product slug | Active product detail with active variants |
| GET | `/api/public/{tenant_slug}/delivery-zones/` | None | `delivery` | BE-006 | Tenant slug | Active delivery zones |
| POST | `/api/public/{tenant_slug}/orders/` | None | `orders` | BE-008/BE-009 | Customer, address, schedule, zone, items, payment method, age/terms flags | Created pending order summary |
| GET | `/api/public/{tenant_slug}/orders/{order_code}/status/` | None | `orders` | BE-011 | Tenant slug and order code | Safe public order status |

## Admin Endpoints

| Method | Endpoint | Auth | App | Milestone | Request Summary | Response Summary |
|---|---|---|---|---|---|---|
| GET | `/api/admin/orders/` | Required later | `orders` | BE-014 | Filters later | Order list |
| GET | `/api/admin/orders/{id}/` | Required later | `orders` | BE-014 | Order id | Internal order detail |
| PATCH | `/api/admin/orders/{id}/status/` | Required later | `orders` | BE-014 | New status, note | Updated order status |
| PATCH | `/api/admin/orders/{id}/payment/` | Required later | `payments` | BE-014 | Payment status/reference | Updated payment/order payment status |
| POST | `/api/admin/orders/{id}/delivery-verification/` | Required later | `compliance` | BE-014 | Receiver verification data | Delivery verification result |
| GET | `/api/admin/products/` | Required later | `products` | BE-014 | Filters later | Product list |
| POST | `/api/admin/products/` | Required later | `products` | BE-014 | Product fields | Created product |
| PATCH | `/api/admin/products/{id}/` | Required later | `products` | BE-014 | Product changes | Updated product |
| GET | `/api/admin/dashboard/summary/` | Required later | `orders` | BE-015 | Optional date filters | Summary metrics |

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
