# UI-001 — Mobile Demo UI Polish

## Task
Polish the mobile UI for the Drinklivery Raspberry Pi demo site to make it look like a clean MVP store rather than a dev prototype.

## Scope
- UI polish only; no backend changes, no new dependencies, no React Router, no payment/WhatsApp/ID uploads.
- Minimal changes to `App.jsx`, `HomeCatalog.jsx`, and `styles.css`.

## Changes

### 1. Removed dev overlays from `App.jsx`
- Removed floating `.dev-status` and `.dev-admin-btn` elements from the customer catalog view.
- Added `onOpenAdmin` prop to `HomeCatalog` — forwarded to `App.jsx` as `() => setView('admin-orders')`.

### 2. Rewrote `HomeCatalog.jsx`

#### Nav items
- Removed `Events` and `Account` from `NAV_ITEMS` — only `Explore` (search SVG) and `Cart` (shopping bag SVG) remain.
- Replaced two-letter text icons with inline SVG icons (20x20px).

#### Top-bar admin link
- Added a subtle gear SVG (16x16) inside the top-bar actions section.
- `opacity: 0.45`, hover to `0.9` with background tint.
- Only renders when `onOpenAdmin` prop is provided.

#### Hero section
- Added `.hero--compact` class: reduced `padding` to `var(--spacing-md)`, `font-size: clamp(24px, 5.5vw, 32px)` for title.
- Removed random hero image; hero text-only with glow.
- Age badge text aligned with "legal drinking age" language.

#### Product card
- Image-wrap height reduced to `clamp(120px, 17vw, 160px)`.
- Placeholder gradient (Cocktail/Mocktail) replaces broken `<img>` — gradient uses design tokens, not fallback text.
- Name: `clamp(15px, 2.8vw, 18px)` with `-webkit-line-clamp: 1` + `text-overflow: ellipsis`.
- Description: `clamp(12px, 2vw, 13px)` clamped to 2 lines.
- Price wrapper added; price `clamp(17px, 3.2vw, 22px)`.
- Add button: `2.25rem` circle with `+` SVG.
- `margin-bottom: var(--spacing-md)` on the product grid body.

#### Sticky cart bar
- Only renders when `cartCount > 0` (prevents empty-state dominance).
- Positioned at `bottom: calc(3.75rem + 0.5rem)` above bottom nav.
- Max width 640px, full width within that, pill-shaped with glassmorphism.
- Shows item count and subtotal.

#### Bottom nav
- Height reduced from `5rem` to `3.75rem`.
- Icon container `22x22px`, label font `10px`.

#### Product grid
- `margin-bottom: 9rem` to account for fixed cart bar + bottom nav.

### 3. CSS changes in `styles.css`

- Added `.top-bar__admin-link` styles (opacity, hover).
- Added `.hero--compact` overrides for title/subtitle.
- Added `.product-card__img-placeholder` gradient styling.
- Added `.product-card__placeholder-text` styling (uppercase, tinted).
- Updated `product-grid` margin-bottom to `9rem`.
- Updated typography across product card to use `clamp()` for mobile.
- Updated `.bottom-nav` and `.nav-item` sizes.
- Updated `.cart-bar` positioning and sizing.
- Removed `.dev-status` and `.dev-admin-btn` CSS blocks (lines 696-733 of previous version).

## Build
`npm run build` — PASSED (38 modules, 541ms).

## Visual Review
- Top bar fixed at 4rem — admin link in top-right, opacity 0.45, reveal on hover.
- Compact hero — text-only, no image, proper spacing via `var(--spacing-md)`.
- Product card — gradient placeholder visible when images fail, text truncated correctly.
- Cart bar — hidden until items exist, sits 0.5rem above bottom nav.
- Bottom nav — 3.75rem height, compact icons + labels.
- No remaining dev-only elements.

## Cloud Review Corrections

- Removed leftover fake account avatar `A` from the catalog header.
- Removed dead `APP_BASE_URL`/`baseUrl` usage from `App.jsx` after dev status removal.
- Adjusted `HomeCatalog.css` so `.product-card__servings` no longer overrides compact card spacing/typography.
- Replaced remaining `DR` placeholders in product detail and cart fallback with intentional demo copy.
- Reran `npm run build` successfully after corrections.

## Remaining Visual Checks (Manual)
1. Verify product detail view's fixed header doesn't overlap bottom nav content on mobile.
2. Verify cart bar doesn't overlap product text on small devices (320px width).
3. Check that gradient placeholder text is legible against the gradient background.
4. Verify admin gear icon is discoverable enough for demo purposes.

## Files Modified
- `/home/adrian10/Projects/drinkliveryapp/frontend/src/App.jsx` — removed dev overlays, added onOpenAdmin prop
- `/home/adrian10/Projects/drinkliveryapp/frontend/src/components/HomeCatalog.jsx` — full component rewrite for demo quality
- `/home/adrian10/Projects/drinkliveryapp/frontend/src/styles.css` — CSS changes as described above
