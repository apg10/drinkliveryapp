# FE-002B — Product Detail View (No Routing)

## Status
Completed — `npm run build` succeeded.

## Summary

Added a product detail view to the frontend without any routing library. Clicking a product card in the catalog swaps the root component state to render the detail view. Clicking "Back to catalog" swaps back to the catalog.

## Files Modified

- **`frontend/src/api.js`** — Added `getPublicProduct(tenantSlug, productSlug)` helper that calls `GET /public/{tenant_slug}/products/{product_slug}/`.

- **`frontend/src/App.jsx`** — Replaced static render with stateful `catalog`/`detail` view switch. Uses `useState` (no router). Calls `openDetail(slug)` which invokes `getPublicProduct` then sets `view: 'detail'`. Shows catalog by default, detail when a product is selected.

- **`frontend/src/components/ProductDetail.jsx`** (new) — Product detail component inspired by Stitch `product_detail_mvp`. Renders:
  - Fixed top bar with "back to catalog" arrow button
  - Full product image (from API `image` with placeholder fallback)
  - Alcoholic / Non-alcoholic badge + servings badge overlay on image
  - Product name (headline-lg → display-lg on desktop)
  - Description with pricing on the right
  - Servings line
  - Divider
  - Variant radio selector (if `product.variants` returned by API) — selecting a variant updates the displayed price
  - Quantity stepper (1–N)
  - Legal drinking age compliance notice
  - Static "Add to Cart" button showing price × qty (no cart logic)

- **`frontend/src/components/HomeCatalog.jsx`** — Product cards now:
  - Accept `onOpenDetail` prop from `App.jsx`
  - Are clickable (`cursor: pointer` + `onClick`) → calls `onOpenDetail(product.slug || product.id)`
  - Use `image` from API for product card images (falls back to placeholder)
  - Age badge changed from "Must be 18+ to purchase alcohol" to "Must be of legal drinking age to purchase alcohol"

- **`frontend/src/styles.css`** — Added `=== Product Detail ===` section with all product detail styles:
  - `.product-detail` root, header, body (stacked mobile / side-by-side desktop)
  - `.product-detail__image-card`, `.product-detail__image`, image placeholder
  - Badges overlay on image
  - Content area: name, price, description, servings
  - Variant selector with radio inputs styled as glass panels
  - Quantity stepper
  - Compliance notice
  - "Add to Cart" CTA button with glow shadow
  - Responsive: stacked layout on mobile, split image-left/content-right on desktop

- **`frontend/README.md`** — Updated "Static MVP Scope" section to document Product Detail view features.

- **`ai_context/02-LOG.md`** — Added FE-002B execution entry.

## Key Decisions

1. **No routing library** — View state managed purely with `useState` in `App.jsx`. This keeps the bundle light and avoids react-router dependencies for an MVP. Navigation is a simple conditional render.

2. **Variant selector** — Uses native `<input type="radio">` elements with CSS-driven glassmorphism styling. Selecting a variant updates the displayed price without page reload.

3. **Quantity stepper** — Simple `+`/`-` buttons with `Math.max(1, q-1)` clamping. Displayed price = variant price × qty.

4. **"legal drinking age"** — Used language compliant with Panama (no "18+" or "21+"). The compliance notice is static and present in the product detail view.

5. **Add to Cart — static** — Button renders with updated price but no cart state or API call yet (out of scope).

6. **Images** — Product image URL from API (`image` field). Falls back to a text placeholder if no image URL is provided. The HomeCatalog product cards also use `image` from API response.

## What's NOT in scope (per task spec)

- Checkout flow
- Cart behavior (state or API)
- Admin UI
- Router integration

## Build

```
cd frontend && npm run build
```

Both `npm install` and `npm run build` have succeeded.
