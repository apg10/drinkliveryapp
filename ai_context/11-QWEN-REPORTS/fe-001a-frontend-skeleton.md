# FE-001A: Frontend Skeleton Report

## Summary

React + Vite frontend skeleton created under `frontend/`. The Stitch "Premium Tropical Nightlife" visual direction was converted into plain CSS with custom properties — no Tailwind CDN, no Material Symbols CDN, no CSS-in-JS.

## Files Created

| File | Purpose |
|------|---------|
| `frontend/package.json` | NPM manifest (React 19, Vite 6) |
| `frontend/index.html` | Entry HTML (Google Fonts: Space Grotesk + Inter) |
| `frontend/src/main.jsx` | React entry, StrictMode, creates root |
| `frontend/src/App.jsx` | Root component → renders HomeCatalog |
| `frontend/src/styles.css` | Global styles with all Stitch design tokens as CSS variables |
| `frontend/src/components/HomeCatalog.jsx` | Static catalog page (hero, chips, 3 product cards, cart bar, bottom nav) |
| `frontend/src/components/HomeCatalog.css` | Component-scoped overrides |
| `frontend/.env.example` | Placeholder `VITE_API_BASE_URL` |
| `frontend/README.md` | Project docs, design system reference, run instructions |

## Design Tokens (CSS Variables)

All tokens derived directly from `stitch_drinklivery_premium_cocktail_experience/premium_tropical_nightlife/DESIGN.md`:

- **Surface palette**: Navy `#0e1323` with glassmorphism (`rgba(17,24,39,0.7)` + `backdrop-filter: blur(20px)`)
- **Primary**: `#ffb4a3` (Sunset Orange) — CTAs, branding
- **Primary Container**: `#ff6b4a` — add-to-cart buttons, active chips
- **Secondary**: `#a0d757` (Lime Mint) — mocktail/refresh indicators
- **Tertiary**: `#eec058` (Amber Glow) — alcoholic tags
- **Typography**: Space Grotesk (headlines) + Inter (body)
- **Radius**: 1.25rem cards, 9999px pills
- **Glow**: `rgba(255,107,74,0.3)` outer shadows
- **Dark mode only**

## Static MVP Components

### Product Cards

| Product | Price | Type |
|---------|-------|------|
| Mojito Pack x4 | $28 | Alcoholic |
| Margarita Pack x4 | $32 | Alcoholic |
| Passion Fruit Mocktail Pack x4 | $22 | Non-alcoholic |

### Layout

- **Mobile (single column)**: Full-width cards, sticky cart bar at bottom, bottom nav at screen edge
- **Tablet (≥640px)**: 2-column grid, cart bar centered
- **Desktop (≥1024px)**: 3-column grid, bottom nav hidden, cart bar centered

### UI Sections

1. **Top App Bar** — fixed, glassmorphic, brand name + avatar
2. **Hero** — headline, subtitle, legal drinking age badge, placeholder image, decorative glow
3. **Category Chips** — horizontal scroll, active/inactive states
4. **Product Grid** — 3 glass cards
5. **Sticky View Cart** — fixed bar placeholder (`$0.00`), no cart logic yet
6. **Bottom Nav** — Explore / Events / Cart / Account (mobile only)

## Build Output

```
npm install    → 68 packages, 0 vulnerabilities (8s)
npm run build  → 26 modules, 583ms, 3 artifacts (740B HTML, 11kB CSS, 198kB JS)
```

## Out of Scope (per FE-001A)

- No backend API integration (endpoints defined in `ai_context/14-ENDPOINT-MATRIX.md`)
- No cart state management
- No checkout flow
- No admin UI
- No authentication
- No routing (single-page, single view)
