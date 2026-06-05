# IMG-001A — Missing Image Fallbacks

## Summary

Made product image rendering resilient when seeded image URLs point to files that do not exist yet. The catalog and cart now hide broken images and show the existing fallback placeholders (cocktail/mocktail gradient panels in the catalog, and the `cart-item__img-placeholder` in the cart) instead of leaving native browser broken-image icons.

## Files Changed

1. **frontend/src/components/HomeCatalog.jsx**
   - Added `failedImages` state (Set) to track image URLs that have failed to load per product card.
   - Added `handleImageError` callback that records a URL in the set and triggers a re-render.
   - Changed the `premium-card__image` conditional rendering logic from `{product.image ? <img> : <fallback>}` to `{(product.image && !failedImages.has(product.image)) ? <img onError={...} /> : <fallback>}`, so that when an image HTTP request fails, the card automatically falls through to the cocktail/mocktail gradient fallback.
   - Existing fallback visual classes and badge behavior are preserved untouched.

2. **frontend/src/App.jsx**
   - Added `failedCartImages` state (Set) inside the `CartView` inner component.
   - Added `handleCartItemImageError` callback that records a failed URL in the set.
   - Changed the cart image conditional rendering from `{item.imageUrl ? <img> : <placeholder>}` to `{item.imageUrl && !failedCartImages.has(item.imageUrl) ? <img onError={...} /> : <placeholder>}`, so that when a cart item image fails to load, it falls back to the existing `cart-item__img-placeholder` div instead of showing a broken-image icon.
   - No other cart behavior changed.

## Build Result

- **Command:** `cd frontend/ && npm run build`
- **Result:** Built successfully.
  - `dist/index.html` — 0.74 kB (gzipped: 0.42 kB)
  - `dist/assets/index-DOJgHROu.css` — 77.59 kB (gzipped: 10.37 kB)
  - `dist/assets/index-9HlttJYw.js` — 264.58 kB (gzipped: 74.07 kB)

## Catalog Broken-Image Fallback Behavior

Before this change, when a product's `image` URL pointed to a missing file (e.g., `/catalog/mojito-pack-x4.webp` before the asset was generated), the `<img>` tag rendered but showed a native browser broken-image icon/alt text alongside no fallback at all.

After this change:
1. The catalog renders the `<img>` normally while `product.image` is truthy and not yet failed.
2. If the browser fires an `error` event on the `<img>`, `handleImageError(product.image)` records that URL in local state and triggers a re-render.
3. On re-render, `failedImages.has(product.image)` returns `true`, so the ternary falls through to the existing `<div class="premium-card__fallback ...">` element with the cocktail/mocktail gradient styling.
4. The badge (Alcoholic / Non-alcoholic) and all other visual classes remain as-is, because they are not controlled by the fallback logic.

## Cart Broken-Image Fallback Behavior

Before this change, if a cart item had an `imageUrl` pointing to a nonexistent file, the cart rendered the `<img>` tag which showed a broken-image icon.

After this change:
1. The cart renders the `<img>` normally while `item.imageUrl` is truthy and not yet failed.
2. If the browser fires an `error` event, `handleCartItemImageError(item.imageUrl)` records that URL in local state and triggers a re-render within `CartView`.
3. On re-render, `failedCartImages.has(item.imageUrl)` returns `true`, so the ternary falls through to the existing `<div class="cart-item__img-placeholder">Pack</div>` element.
4. The existing `.cart-item__img-placeholder` CSS already styles this as a gradient background with centered "Pack" text and reduced opacity, consistent with the cart's glass-panel aesthetic.

## Confirmations

- **No backend code was modified.** Only `HomeCatalog.jsx` and `App.jsx` were changed in the frontend.
- **No product image URLs or seed data were changed.** URLs remain `/catalog/mojito-pack-x4.webp`, `/catalog/margarita-pack-x4.webp`, `/catalog/passion-fruit-mocktail-pack-x4.webp`.
- **No generated images were added.** Image files still need to be generated later (IMG-007 or downstream).
- **No dependencies were added.** Only the existing built-in React hooks are used.
- **No checkout API payloads or public API helpers were changed.** No changes to `api/` module files, checkout forms, or API calls.
- **No UI redesign was performed.** The existing fallback placeholders and badge behavior are preserved exactly as they were. CSS requires no additions because existing `.premium-card__fallback`, `.premium-card__fallback--cocktail`, `.premium-card__fallback--mocktail`, `.premium-card__fallback-label`, and `.cart-item__img-placeholder` classes already provide the correct visuals.
