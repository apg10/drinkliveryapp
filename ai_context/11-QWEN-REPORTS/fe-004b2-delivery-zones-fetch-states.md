# fe-004b2-delivery-zones-fetch-states

## Summary

Added delivery zone fetch and display to the checkout view per microtask FE-004B2. CheckoutView.jsx now imports `getPublicDeliveryZones` from the API client, fetches active zones for tenant slug `drinklivery-panama` when the component renders and the cart is not empty, and renders three states: loading (skeleton cards with shimmer animation), error (readable error text with retry button), and empty (message when no zones are returned). When zones are available, selectable delivery zone cards render with name, city, base fee, minimum order amount (if present), and a radio pill. Default selected zone is the first returned zone. Existing flat delivery fee totals remain unchanged.

## Files changed

### Allowed files modified

- `frontend/src/components/CheckoutView.jsx`
  - Added import of `getPublicDeliveryZones` from `../api.js`
  - Added `TENANT_SLUG = 'drinklivery-panama'`
  - Added local state: `zones`, `loading`, `error`, `selectedZoneId`
  - Added `fetchZones()` that calls `getPublicDeliveryZones(TENANT_SLUG)`, reads `{ zones: [...] }` shape, sets zones and auto-selects first zone
  - Added `useEffect` that triggers fetch when cart is not empty, clears state when cart is empty
  - Added `handleRetry` for error state
  - Added `renderDeliveryZonesSection()` method returning loading/error/empty/cards states
  - Inserted delivery zones section between `checkout-view__note` and `checkout-view__form`
  - Zone card includes `delivery-zone-card__radio`, name, base fee, and optional min order

- `frontend/src/styles.css`
  - Added `.delivery-zones-section` section styles
  - Added `.delivery-zones-section__loading` skeleton layout
  - Added `.delivery-zones-skeleton-card` with shimmer keyframe animation
  - Added `.delivery-zones-section__error` with error text and retry button styles
  - Added `.delivery-zones-section__empty` with empty state text
  - Added `.delivery-zones-section__cards` grid for zone cards
  - Added `.delivery-zone-card` with active state styles
  - Added `.delivery-zone-card__radio`, `__left`, `__info`, `__name`, `__delivery-fee`, `__min-order`
  - Added responsive rule for desktop at 640px with max-width

### Files NOT modified (confirmed)

- `frontend/src/App.jsx` - no changes
- `frontend/src/api.js` - no changes (used existing `getPublicDeliveryZones`)
- No backend files modified
- No new dependencies added

## Loading/error/empty state behavior

### Loading state
- Shown when `loading` is true (after fetch starts, before response arrives)
- Displays two skeleton cards with shimmer animation via `@keyframes delivery-zones-shimmer`
- Section title "Select delivery area" is always visible

### Error state
- Shown when `error` is set (fetch rejected)
- Displays the fetched error message text in red (`var(--error)`)
- Includes a "Retry" button that re-calls the fetch

### Empty state
- Shown when `zones.length === 0` and no error
- Displays "No delivery zones are available right now."

### Cards state
- Shown when zones are loaded successfully
- Each zone rendered as a glass-card with radio indicator, name, base fee, and optional min order display
- Selected zone has highlighted border and filled radio pill
- Default selection is first zone in array

## Build result

```
> drinklivery-frontend@0.1.0 build
> vite build

✓ 29 modules transformed.
✓ built in 532ms

dist/index.html                   0.74 kB │ gzip:  0.42 kB
dist/assets/index-C-HldyDP.css   37.77 kB │ gzip:  5.77 kB
dist/assets/index-DGQ8jr-S.js   224.82 kB │ gzip: 66.91 kB
```

Build succeeded with no errors.

## Checkout totals confirmation

Checkout totals were NOT changed. The existing flat delivery fee rendering in `checkout-view__summary` remains untouched:

```jsx
<div className="checkout-view__summary-row">
  <span>Delivery fee</span>
  <span>${deliveryFee.toFixed(2)}</span>
</div>
<div className="checkout-view__total-row">
  <span>Total</span>
  <span className="checkout-view__total-value">${total}</span>
</div>
```

Dynamic zone-based pricing will be addressed in a future microtask.

## Task status

Ready for Codex/OpenCode review.
