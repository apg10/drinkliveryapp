# FE-010B2: Catalog Badge Class Cleanup

## Summary

Replaced fragile CSS attribute selectors (`.premium-card__badge[style*="..."]`) with explicit BEM modifier classes on the badge element. The inline `style={{ background, color }}` prop was removed from the badge span since all styling is now handled via CSS classes.

## Files Changed

1. `frontend/src/components/HomeCatalog.jsx`
   - Removed intermediate variables `badgeBg` and `badgeColor` (no longer used)
   - Added modifier class name to badge: `premium-card__badge--alcoholic` or `premium-card__badge--mocktail`
   - Removed inline `style={{ background: badgeBg, color: badgeColor }}` from `<span className="premium-card__badge">`

2. `frontend/src/components/HomeCatalog.css`
   - Removed `[style*="a0d757"]` and `[style*="#eec058"]` attribute selectors (4 rules -> 2 modifier classes)
   - Added `.premium-card__badge--alcoholic` — green gradient background, secondary text color, green border
   - Added `.premium-card__badge--mocktail` — amber gradient background, tertiary text color, amber border

## Cleanup Performed

- **Before**: Badge styles depended on `[style*="a0d757"]` matching inline style serialized strings. This is fragile because:
  - CSS attribute substring match depends on exact property order and value serialization in the rendered DOM
  - If the backend or build tool changes gradient format (e.g., `rgb()` vs `rgba()`, color name vs hex), selectors silently break
- **After**: Badge styles use explicit BEM modifier classes applied directly to the element. This is declarative and resilient to any CSS serialization differences.

## Build Command

```bash
cd frontend/ && npm run build
```

## Build Result

Build succeeded with no errors. Output:
- `dist/index.html` — 0.74 kB (gzip: 0.42 kB)
- `dist/assets/index-DOJgHROu.css` — 77.59 kB (gzip: 10.37 kB)
- `dist/assets/index-C2ZiTSGo.js` — 264.31 kB (gzip: 73.94 kB)

## Forbidden Files Check

- No backend files modified.
- `.gitignore` not touched.
- `imagenes_evidencia/` not touched.
- ProductDetail, cart, checkout, confirmation, tracking, admin, deploy, Docker, API, styles.css not touched.
- No git add, commit, or push performed.
- No dependencies added.

## Task Status

**Ready for Codex/OpenCode review — after build passes.**
