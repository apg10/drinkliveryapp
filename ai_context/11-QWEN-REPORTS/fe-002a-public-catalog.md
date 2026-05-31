# FE-002A — Fetch and Display Public Catalog

## Task

Fetch and display the public catalog from the backend API.

## Changes

### frontend/src/components/HomeCatalog.jsx

- Replaced hardcoded `PRODUCTS` array with API-driven data via `getPublicCatalog("drinklivery-panama")`
- Added `loading`, `error`, `categories`, `products` state via `useState` + `useEffect`
- Categories render as filterable chips with an "All" option using backend category objects.
- Products rendered from API response with:
  - name
  - description
  - base price (formatted as `${product.base_price}`)
  - servings (if `product.servings` is present)
  - alcoholic/non-alcoholic badge with colored dot and label
- Loading state: floating pill with "Loading catalog..." text
- Error state: floating card with title, error message, and Retry button
- Empty state: floating pill with "No products available" when no products returned
- Component-level filter: when a category chip is active, only products whose `categorySlug` matches that category are shown.

### frontend/src/components/HomeCatalog.css

- Added `.product-card__servings` — italic small text for servings info
- Added `.catalog-loading` — floating pill for loading indicator
- Added `.catalog-error` — red-tinted card with error title, message, and retry button
- Added `.catalog-empty` — floating pill for empty catalog

### frontend/src/api.js

- No changes — `getPublicCatalog(tenantSlug)` already implements `GET /public/{tenant_slug}/catalog/`

### frontend/src/App.jsx

- No changes — already renders `<HomeCatalog />` with dev status line

### frontend/README.md

- Updated MVP scope to reflect API-driven products, loading/error/empty states, and field list
- Added FE-002A note

### ai_context/02-LOG.md

- Added FE-002A execution log entry

## What was NOT implemented (per task scope)

- Product detail view
- Cart behavior
- Checkout
- Admin UI
- Persistent category filter state outside the component

## Build

`npm.cmd run build` — succeeded.

## Review Fixes

- Catalog response handling was corrected to flatten backend `categories[].products[]` into product cards.
- Retry button now triggers a fresh catalog fetch.
