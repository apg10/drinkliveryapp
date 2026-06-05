# IMG-002: Add Browser and Social Metadata

## Summary

Added favicon, Apple touch icon, theme-color, Open Graph, and Twitter Card metadata to `frontend/index.html` so Drinklivery displays a browser icon and rich social previews when shared. Used the asset paths documented in `ai_context/23-IMAGE-ASSET-PLAN.md` and matched the existing dark UI color (`#0e1323`) for `theme-color`.

## Files Changed

| File | Change |
| --- | --- |
| `frontend/index.html` | Added 11 metadata links/meta tags in `<head>`; preserved existing title, Google Fonts preconnect and stylesheet. |
| `ai_context/11-QWEN-REPORTS/img-002-brand-metadata.md` | This report (new file). |

## Build Result

```
> drinklivery-frontend@0.1.0 build
> vite build

vite v6.4.2 building for production...
transforming...
✓ 38 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.73 kB │ gzip:  0.66 kB
dist/assets/index-DOJgHROu.css   77.59 kB │ gzip: 10.37 kB
dist/assets/index-9HlttJYw.js   264.58 kB │ gzip: 74.07 kB
✓ built in 604ms
```

Build succeeded with no errors or warnings.

## Metadata Tags Added

### Browser icons

| Tag | Value |
| --- | --- |
| `<link rel="icon" ...>` | `href="/favicon.png"` |
| `<link rel="apple-touch-icon" ...>` | `href="/apple-touch-icon.png"` |
| `<meta name="theme-color" content="#0e1323">` | Matches dark Drinklivery UI surface (`--surface: #0e1323`) |

### Open Graph (og:*)

| Tag | Value |
| --- | --- |
| `og:title` | `Drinklivery — Cocktails ready for your night` |
| `og:description` | `Premium cocktail packs delivered to your door. Fresh ingredients, bartender-crafted recipes, and zero fuss.` |
| `og:type` | `website` |
| `og:image` | `/brand/drinklivery-og.webp` |
| `og:site_name` | `Drinklivery` |

### Twitter Card (twitter:*)

| Tag | Value |
| --- | --- |
| `twitter:card` | `summary_large_image` |
| `twitter:title` | `Drinklivery — Cocktails ready for your night` |
| `twitter:description` | `Premium cocktail packs delivered to your door. Fresh ingredients, bartender-crafted recipes, and zero fuss.` |
| `twitter:image` | `/brand/drinklivery-og.webp` |

## Confirmations (Forbidden Changes)

- **No backend files modified.**
- **No React source files modified.**
- **No CSS files modified.**
- **No generated images added** (assets are referenced but not created in this task).
- **No dependencies added.**
- **No PWA manifest or service worker added.**
- **Existing Google Fonts preconnect and stylesheet links preserved unchanged.**
- **Existing page title preserved unchanged.**
- **No git commit, push, or `git add .` performed.**
