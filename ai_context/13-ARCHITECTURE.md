# Backend Architecture

## Architecture Style

Drinklivery uses a modular Django monolith.

The backend is API-first and domain-organized by Django apps.

Initial database is SQLite for local development. PostgreSQL will be introduced later for staging or production.

## Target Repository Structure

```text
drinklivery/
  ai_context/
  backend/
    manage.py
    requirements.txt
    .env.example
    pytest.ini
    config/
      __init__.py
      settings.py
      urls.py
      asgi.py
      wsgi.py
    apps/
      __init__.py
      core/
      accounts/
      tenants/
      products/
      orders/
      delivery/
      payments/
      compliance/
      notifications/
  frontend/
  docs/
```

Do not create all apps at once. Add apps by milestone.

## Django Apps

### `apps.core`

Responsibilities:

- Health endpoint
- Shared utilities only when needed
- No business logic initially

### `apps.accounts`

Responsibilities:

- Internal users later
- Admin/operator/bartender/driver roles later
- Use Django User initially unless a strong reason appears

### `apps.tenants`

Responsibilities:

- Tenant
- Storefront settings
- Operating schedule
- Future multi-market readiness

### `apps.products`

Responsibilities:

- Categories
- Products
- Product variants
- Active/inactive public catalog filtering
- Tenant catalog isolation

### `apps.orders`

Responsibilities:

- Customers
- Addresses
- Orders
- Order items
- Order status history
- Checkout logic
- Order total calculation

### `apps.delivery`

Responsibilities:

- Delivery zones
- Delivery fee base rules
- Delivery assignment later if needed

### `apps.payments`

Responsibilities:

- Manual payment records
- Payment statuses
- Later integrations only after approval

### `apps.compliance`

Responsibilities:

- Delivery verification
- Compliance events
- Failed age verification workflow
- Alcohol handoff traceability

### `apps.notifications`

Responsibilities:

- Notification logs
- Manual WhatsApp/link logging initially
- Future WhatsApp API only after approval

## API Strategy

Use Django REST Framework function-based views or `APIView` for simple endpoints.

Use serializers for request validation and response formatting once payloads are non-trivial.

Do not add viewsets/routers by default. Use explicit URLs first because the API surface is small and business-specific.

Public endpoints must not require customer login in MVP.

Admin endpoints must eventually be protected, but authentication can be deferred until core backend workflows exist.

## Model Strategy

Use normal Django models with explicit fields.

Use tenant foreign keys where market isolation matters.

Use decimal fields for money.

Use status choice fields for order and payment states.

Avoid generic JSON fields unless there is a concrete need.

Avoid premature abstraction.

## Testing Strategy

Use pytest and pytest-django.

Use DRF `APIClient` for API tests.

Every endpoint must have tests.

Every compliance-sensitive rule must have tests.

Every checkout calculation must have tests.

Tenant isolation must be tested whenever tenant-scoped data is exposed.

## Security And Compliance Principles

- Do not store ID document images.
- Do not expose internal admin notes through public endpoints.
- Public order status endpoint must return only safe fields.
- Alcohol delivery verification must be traceable.
- Failed age verification must be represented as an order status.
