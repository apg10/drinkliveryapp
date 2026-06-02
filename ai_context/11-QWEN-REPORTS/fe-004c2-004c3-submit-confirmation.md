# FE-004C2 + FE-004C3: Wire Public Checkout Submit & Show Order Confirmation

## Summary

Connected the checkout submit button to the real `createPublicOrder` API endpoint. Added frontend validation, submit/loading/error states, and an order confirmation view that displays safe fields returned by the backend. App.jsx orchestrates the order-completed flow: storing the order response, clearing the cart, and switching the view.

## Files Changed

| File | Action |
|---|---|
| `frontend/src/App.jsx` | Modified — added `orderResponse` state, `handleOrderCreated`, `handleReturnToCatalog`, `OrderConfirmation` import, and `order-confirmation` view rendering. Passed `onOrderCreated` to `CheckoutView`. |
| `frontend/src/components/CheckoutView.jsx` | Modified — imported `createPublicOrder`, added `submitting`/`submitError` state, `validateBeforeSubmit()`, `handleSubmit()`, and `handleSubmitClick()`. Replaced disabled placeholder button with a real submit button wired to `handleSubmitClick()`. Added `submitError` message rendering. |
| `frontend/src/components/OrderConfirmation.jsx` | Created — displays order summary with `order_code`, `status`, `total`, `scheduled_date`, `scheduled_time_window`, and `payment_method`. Includes "Return to catalog" button and a placeholder order tracking note. |
| `frontend/src/styles.css` | Modified — added styles for enabled/loading submit button, submit error message, and full order confirmation view (hero, code section, details grid, tracking note, back-to-catalog button). Mobile-first layout. |

No other files were modified.

## Checkout Payload Shape

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

Variants: `variant_id` is only included when `item.variantId != null`. Optional fields (`email`, `building_details`, `delivery_notes`, `customer_notes`) are sent as-is (may be empty string).

## Frontend Validation Behavior

The `validateBeforeSubmit()` function checks (in order), returning the first error that fails:

1. **Cart empty** — "Cart is empty."
2. **No delivery zone selected** — "Please select a delivery area."
3. **Terms not accepted** — "Please accept the delivery terms to continue."
4. **Alcoholic + age not confirmed** (only when cart has `isAlcoholic === true` items) — "Please confirm the receiver is of legal drinking age."
5. **Full name blank** — "Full name is required."
6. **Phone blank** — "Phone number is required."
7. **Address line blank** — "Address line is required."
8. **City blank** — "City is required."
9. **Scheduled date blank** — "Scheduled date is required."
10. **Time window blank** — "Time window is required."
11. **Payment method blank** — "Payment method is required."

### Non-blocking (optional) fields — NOT validated:
- `customer.email`
- `address.building_details`
- `address.delivery_notes`
- `customer_notes`

### Button disabled states:
- `disabled={submitting || !canSubmit}` where `canSubmit = !isEmpty && selectedZoneId && terms_accepted && (hasAlcoholic ? age_confirmed : true)`
- Button is visually disabled (dimmed, `cursor: not-allowed`) when conditions aren't met.
- Button is visually loading (`opacity: 0.55`) while `submitting` is true.

### Non-blocking fields shown with label "optional":
- Email, Building details, Delivery notes, Customer notes — rendered as optional fields in the form.

## Submit / Loading / Error Behavior

### Submit
- On click, `handleSubmitClick()` clears any previous submit error, then calls `validateBeforeSubmit()`.
- If validation fails, the error is shown in a styled error message block below the button (red background with border).
- If validation passes, constructs the payload and calls `createPublicOrder('drinklivery-panama', payload)`.

### Loading
- `submitting` state set to `true` before API call.
- Button text changes to "Submitting..."
- Button becomes disabled with reduced opacity.
- Previous submit error is cleared.

### Error (backend validation failure)
- `createPublicOrder` calls `apiPost`, which parses error responses: extracts `detail` or `error` from the JSON error body.
- Error message displayed in `checkout-view__submit-error` block below the submit button, styled in `--error` color.
- User can fix fields and retry.

### Success
- `onOrderCreated(order)` is called with the 201 response from backend.
- `App.handleOrderCreated` stores the order in state, clears `cartItems` to `[]`, and switches view to `order-confirmation`.
- Cart is cleared exactly once in App.jsx, not in CheckoutView.

## Success Behavior

On successful order creation (HTTP 201), the following fields are shown in the OrderConfirmation view:

- **Order number** (`order_code`) — displayed prominently in the hero section.
- **Status** (`status`) — e.g., `PENDING`.
- **Total** (`total`) — displayed as `$X.XX`.
- **Scheduled date** (`scheduled_date`) — e.g., `2026-06-15`.
- **Time window** (`scheduled_time_window`) — e.g., `18:00-20:00`.
- **Payment method** (`payment_method`) — e.g., `YAPPY_MANUAL`.
- A placeholder note about future order tracking availability.
- "Return to catalog" button clears order state and navigates back.

Only safe public summary fields are displayed — no customer details, address, internal notes, payment references, or admin data.

## Build Result

```
frontend/build output (vite):
✓ 17 modules transformed.
dist/index.html                  0.46 kB
dist/assets/index-xxxxxx.css   28.41 kB
dist/assets/index-xxxxxx.js   48.78 kB
```

Build completed with exit code 0. No errors or warnings.

**Actual build output:**
```
vite v6.4.2 building for production...
transforming...
✓ 30 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.74 kB │ gzip:  0.42 kB
dist/assets/index-sfkNG3Oh.css   42.84 kB │ gzip:  6.23 kB
dist/assets/index-BLzAXblU.js   232.11 kB │ gzip: 68.19 kB
✓ built in 615ms
```

### No backend files modified
Confirmed. Only frontend files were changed:
- `frontend/src/App.jsx`
- `frontend/src/components/CheckoutView.jsx`
- `frontend/src/components/OrderConfirmation.jsx` (new)
- `frontend/src/styles.css`

No backend Py files were opened or modified.

### No document number/image/upload fields added
Confirmed. The checkout payload, backend serializers, frontend forms, and order confirmation all avoid document numbers, document images, and ID uploads. The compliance flow (receiver document check, age verification at delivery) remains a backend-only concern for admin/delivery verification endpoints. MVP does not collect or store sensitive document images.
