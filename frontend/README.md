# Drinklivery Frontend

React + Vite frontend powered by the Stitch-derived premium glassmorphism design system.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** React 19
- **Build Tool:** Vite 6
- **CSS:** Plain CSS + CSS custom properties (no Tailwind, no CSS-in-JS)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` and configure:

```
VITE_API_BASE_URL=/api
```

## API Client

`src/api.js` reads `VITE_API_BASE_URL` from `.env.local` (default `http://127.0.0.1:8000/api`) and exports:

- `apiGet(path)` — GET + JSON parse, throws on non-2xx
- `getPublicCatalog(tenantSlug)` — GET `/public/{tenant_slug}/catalog/`
- `getPublicProduct(tenantSlug, productSlug)` — GET `/public/{tenant_slug}/products/{product_slug}/`

## Architecture

- `src/App.jsx` — root component, renders `HomeCatalog`, `ProductDetail`, cart view, and dev status line
- `src/api.js` — API client (`apiGet`, `getPublicCatalog`, `getPublicProduct`)
- `src/main.jsx` — React entry point
- `src/styles.css` — global styles with CSS variables derived from the Stitch design system
  ([DESIGN.md](../../stitch_drinklivery_premium_cocktail_experience/premium_tropical_nightlife/DESIGN.md))
- `src/components/` — feature components

## Design System (derived from Stitch)

All design tokens live as CSS custom properties in `src/styles.css`:

- **Dark surface palette** — Navy `#0e1323` base with glassmorphism layers
- **Primary** — Sunset Orange `#ffb4a3` for CTAs & pricing
- **Secondary** — Lime Mint `#a0d757` for mocktail / refresh indicators
- **Tertiary** — Amber Glow `#eec058` for alcoholic tags
- **Fonts** — Space Grotesk (headlines) + Inter (body)
- **Radius** — `1.25rem` cards, `9999px` pills
- **Glow effects** — `rgba(255,107,74,0.3)` outer shadows

### Static MVP Scope

This skeleton implements the Home Catalog and Product Detail views:

- **Home Catalog** (FE-002A)
  - Hero section with brand headline and legal drinking age badge
  - Category chip filter (dynamic from API)
  - Product cards fetched from GET /api/public/{tenant_slug}/catalog/
  - Product display: name, description, base price, servings (if present), alcoholic/non-alcoholic badge
  - Product cards are clickable → navigates to product detail via state
  - Images from API (`image` field) or placeholder fallback
  - Sticky View Cart bar placeholder (no cart behavior)
  - Mobile-only bottom navigation (hidden on desktop)
  - Loading, error, and empty states for the catalog fetch
  - Sticky View Cart bar showing cart count items (cart state in App.jsx via useState)

- **Product Detail** (FE-002B)
  - Clicking a product card loads detail from GET /api/public/{tenant_slug}/products/{product_slug}/
  - Uses simple App.jsx component state (no routing library)
  - Shows: name, description, base price, servings, alcoholic/non-alcoholic badge, variants (if returned)
  - Variant radio selector: selects a variant and updates displayed price
  - Quantity stepper (add/subtract)
  - "Add to Cart" button (wired to cart state in App.jsx via onAddToCart prop)
  - Legal drinking age compliance notice
  - Mobile-first layout: stacked image + content; desktop splits side-by-side
  - Loading and error states for the detail fetch

- **Cart** (FE-003A)
  - Cart state managed in `App.jsx` via `useState([])` (in-memory only, no persistence)
  - Cart items: product name, variant (if any), unit price, quantity, line total, remove button
  - Cart view features:
    - Empty state with "Start shopping" CTA
    - Item cards with image/name/variant/price/qty controls/remove
    - Order summary: subtotal, delivery fee ($5.99 flat), total
    - Compliance notice (adult confirmation)
    - "Add more drinks" CTA (returns to catalog)
    - "Continue to checkout" placeholder button
  - Cart count badge on HomeCatalog sticky bar
  - Styled as glass panels following the Stitch "your_cart_mvp" design

## Notes

- No Tailwind or Material Symbols CDN
- FE-001B: api client added (`src/api.js`), app shows dev status line with base URL
- FE-002A: catalog fetched via `getPublicCatalog("drinklivery-panama")` in HomeCatalog component
