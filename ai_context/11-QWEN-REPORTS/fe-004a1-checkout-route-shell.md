# FE-004A1: Checkout Route Shell

## Summary

Added a minimal checkout view route shell that renders a page title, a responsible-delivery note, a cart summary, and a back-to-cart button. When cart items are empty, an empty checkout state with a return-to-catalog button is shown. The cart's "Continue to checkout" button now navigates to the checkout view via `setView('checkout')` instead of showing an alert. No API POST or fetch was added.

## Files Changed

1. **Created:** `frontend/src/components/CheckoutView.jsx`
   - Accepts `cartItems`, `cartSubtotal`, `deliveryFee`, `onBackToCart`, `onBackToCatalog` props.
   - If `cartItems.length === 0`, renders an empty state with "Return to catalog" button.
   - Otherwise renders checkout title, responsible-delivery note, itemized cart summary, subtotal, delivery fee, and total.

2. **Modified:** `frontend/src/App.jsx`
   - Added `import CheckoutView from './components/CheckoutView'`.
   - Replaced cart checkout button `alert('Checkout not implemented yet. This is a placeholder.')` with `setView('checkout')`.
   - Added `if (view === 'checkout')` branch rendering `<CheckoutView>` with the required props.

3. **Modified:** `frontend/src/styles.css`
   - Added `.checkout-view*`, `.checkout-view__header*`, `.checkout-view__back-btn*`, `.checkout-view__title*`, `.checkout-view__body*`, `.checkout-view__section-title*`, `.checkout-view__note*`, `.checkout-view__empty*`, `.checkout-view__summary-row*`, `.checkout-view__item-label*`, `.checkout-view__item-price*`, `.checkout-view__total-row*`, `.checkout-view__total-value*` styles following the existing dark glassmorphism design system.

## Build Result

Build could not be run on this machine - `node` and `npm` are not available in the PATH. The changes follow existing code conventions and JSX structure, so the build should succeed once run in an environment with Node.js installed.

## Tests Added or Updated

N/A (microtask scope excludes tests)

## Test Command Run

N/A (node/npm not available)

## Confirm No API POST / Fetch Added

Confirmed. No checkout API POST, no fetch calls, and no modification to `frontend/src/api.js` were made.
