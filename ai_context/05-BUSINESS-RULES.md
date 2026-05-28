# Business Rules

## Locked MVP Rules

1. Drinklivery does not sell standalone liquor bottles in the MVP.
2. Drinklivery sells cocktail packs, cocktail kits, mocktail packs, and event-oriented bundles.
3. Orders are scheduled by default, not instant-delivery-first.
4. Customers must confirm legal drinking age before placing alcoholic orders.
5. Alcoholic orders require in-person delivery handoff.
6. Alcoholic orders cannot be left at reception, door, lobby, concierge, building entrance, or with minors.
7. Admin/operator can reject orders if area, schedule, availability, or compliance rules are not met.
8. MVP starts with one tenant: Drinklivery Panama.
9. Data model must be single-market MVP but multi-market-ready.
10. Payment integrations are not part of the first backend milestones.
11. WhatsApp API integration is not part of the first backend milestones.
12. Manual payment tracking is acceptable initially.
13. App must support delivery zones.
14. App must support scheduled delivery windows.
15. App must support order state tracking.
16. Compliance data must be handled carefully.
17. MVP must not store sensitive ID document images.

## Operational Language

Use:

`authorized micro-lab for premium cocktail preparation, digital scheduled orders and controlled delivery`

Avoid:

`selling cocktails from home`

## Order Statuses

Initial statuses:

- `PENDING`
- `ACCEPTED`
- `IN_PREPARATION`
- `READY_FOR_DELIVERY`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`
- `REJECTED`
- `FAILED_AGE_VERIFICATION`

Rules:

- Public checkout creates `PENDING` orders.
- Admin can accept or reject orders.
- Failed age verification must be a terminal status.
- Status changes must create `OrderStatusHistory` once workflow exists.

## Payment Statuses

Initial statuses:

- `PENDING`
- `CONFIRMED`
- `FAILED`
- `REFUNDED`
- `CANCELLED`

Initial payment methods:

- `CASH`
- `TRANSFER`
- `YAPPY_MANUAL`
- `OTHER_MANUAL`

No real payment gateway in early milestones.
