# FE-010B: Catalog Mobile Polish for iPhone Safari

## Summary

Polished the HomeCatalog component for iPhone 14 Pro Max Safari to fix five visible issues from Adrian's manual QA: product placeholder contrast, card vertical sizing, bottom nav safe-area handling, catalog scroll padding, and badge readability.

## Files Changed

1. `frontend/src/components/HomeCatalog.jsx` — Added conditional CSS class names for cocktail/mocktail fallback backgrounds and labels (differentiates placeholders by drink type, removes single dark-block style).
2. `frontend/src/components/HomeCatalog.css` — All visual fixes:
   - Mobile product card image aspect reduced from 16/10 to 14/9 on mobile (768px breakpoint) and keeps 16/10 on tablet+.
   - Fallback placeholder backgrounds redesigned: alcoholic cards get warm reddish-orange radial glow; mocktail cards get green-gold radial glow. Both use distinct dark-tint gradients.
   - Fallback label text improved from `opacity: 0.75` with dark background to fully opaque high-contrast text with colored border, slight background tint, and `text-shadow` for Safari legibility.
   - Badge styling enhanced with stronger CSS attribute selector rules (`.premium-card__badge[style*="a0d757"]`, `.premium-card__badge[style*="#eec058"]`) to override inline gradients with semi-opaque tint+border combos, plus added `box-shadow: 0 1px 6px rgba(0,0,0,0.35)` for legibility on any background.
   - Bottom nav padding changed from `padding-bottom: env(safe-area-inset-bottom, 0)` to `padding-bottom: calc(env(safe-area-inset-bottom, 8px) + 6px)` so the nav has guaranteed clearance above Safari's bottom bar.
   - Floating cart bar bottom position recalculated with safe-area inset included: `calc(3.75rem + 0.5rem + env(safe-area-inset-bottom, 0px))`.
   - Catalog grid margin-bottom increased from `9rem` to `calc(9rem + env(safe-area-inset-bottom, 0px))` so the last product card always scrolls above the navigation.

## Visual Behavior Changed

| Before | After (mobile Safari) |
|---|---|
| Placeholder central text dim, opacity 0.75 on dark surface | Fully opaque warm/cool colored text with colored border and subtle glow |
| All placeholders look identical (muddy dark block) | Alcoholic = reddish gradient glow + warm pink text; Non-alcoholic = green-gold gradient glow + amber text |
| Card image area tall (16:10), wasted vertical space | More compact 14:9 on mobile, same 16:10 on desktop |
| Bottom nav touches Safari home indicator area | Nav has `calc(safe-area + 8px) + 6px` bottom clearance |
| Cart bar and catalog content ignore safe area | Both respect `env(safe-area-inset-bottom)` |
| Last product card can sit behind navigation | Extra `env(safe-area-inset-bottom)` added to grid margin-bottom |

## Build Command

```bash
cd frontend/ && npm run build
```

## Build Result

Build succeeded with no errors. Output:
- `dist/index.html` — 0.74 kB (gzip: 0.42 kB)
- `dist/assets/index-C8O7uPZC.css` — 77.67 kB (gzip: 10.39 kB)
- `dist/assets/index-Bll0FLKb.js` — 264.46 kB (gzip: 73.96 kB)

## Forbidden Files Check

- No backend files modified.
- `.gitignore` not touched by this task.
- `imagenes_evidencia/` not touched (ignored directory).
- No git add, commit, or push performed.
- No dependencies added.
- No React Router added.
- No ProductDetail, cart, checkout, confirmation, tracking, admin, deploy, Docker, or API files modified.

## Residual Risk for iPhone Safari Manual QA

1. CSS attribute selectors (`[style*="..."]`) on badges rely on inline style order matching — if the backend changes gradient color value format (hex vs rgb), selectors could break. Monitor if badge styles go unapplied in future.
2. `env(safe-area-inset-bottom)` fallback values differ by iOS version. iPhone 13 and earlier without native safe area may get slightly inconsistent spacing. Worth testing on the oldest supported device.
3. The `calc()` composition around safe-area insets is evaluated at runtime — no server-side issue, but worth QA verification across iPhone SE (3rd gen), iPhone 12 Pro, iPhone 14 Pro Max with Safari browser bar visible/hidden states.
4. Brand new CSS class names (`premium-card__fallback--cocktail`, `premium-card__fallback--mocktail`, `premium-card__fallback-label--mocktail`) — no existing JS depends on them by name.

## Task Status

**Ready for Codex/OpenCode review.**
