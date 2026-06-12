# FE-033 — Commit Scope Proposal

## 1. Summary

This proposal organizes the current dirty working tree on `feature/frontend-app-product-evolution` into three commit scope groups (recommended include, recommended exclude, needs user decision) to prepare for a single human-gated frontend commit. The branch contains ~2542 lines of changes across a major architecture migration (router + motion + cart persistence), 5 new components (+ ~680 combined lines), and 39 untracked report/docs files spanning frontend QA, infrastructure deploy, and feature implementation history. Build passes cleanly. No files modified during this review.

## 2. Current Branch / Status

- **Branch:** `feature/frontend-app-product-evolution`
- **Modified tracked:** 13 files (+2542/-348 lines)
- **Untracked:** 45 files (39 reports, 5 components, 1 asset)
- **Build:** passes ✓ (456 modules, 1.08s, zero errors/warnings)

### Modified tracked files:
```
 M ai_context/19-FRONTEND-EXECUTION-PLAN.md         (+/- updated plan)
 M ai_context/20-FRONTEND-QWEN-PROMPTS.md           (+629 lines)
 M frontend/package.json                             (+2 deps)
 M frontend/package-lock.json                        (synced to deps)
 M frontend/src/App.jsx                              (major rewrite: router + motion + cart + 5 new imports)
 M frontend/src/components/CheckoutView.jsx          (+168 lines)
 M frontend/src/components/HomeCatalog.css           (+459 lines CSS tokens)
 M frontend/src/components/HomeCatalog.jsx           (+182 lines)
 M frontend/src/components/OrderConfirmation.jsx     (+43 lines)
 M frontend/src/components/OrderTracking.jsx         (+265 lines)
 M frontend/src/components/ProductDetail.jsx         (+284 lines)
 M frontend/src/main.jsx                             (+BrowserRouter wrapper)
 M frontend/src/styles.css                           (+28 tokens + --label-sm)
```

### Untracked files (45 total):

| Category | Count | Files |
|----------|-------|-------|
| Reports (ai_context/11-QWEN-REPORTS/) | 39 | See Section 7 |
| New components | 5 | AccountView, SupportHelp, OrderDetailsView, PartyBuilder, ExtrasAddOns |
| Frontend asset | 1 | mojito.png |

## 3. Build Result

```
> drinklivery-frontend@0.1.0 build
> vite build

vite v6.4.2 building for production...
transforming...
✓ 456 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.74 kB │ gzip:   0.66 kB
dist/assets/index-wnt9etul.css   87.17 kB │ gzip:  11.48 kB
dist/assets/index-CmbW0L_q.js   478.41 kB │ gzip: 140.31 kB
✓ built in 1.08s
```

**Result: PASS** — zero errors, zero warnings. All new imports resolve correctly. CSS tokens valid.

## 4. Recommended Frontend Commit File List (Group A)

These files should be included in the frontend commit for this iteration.

### Source code (must include):
| File | Type | Reason |
|------|------|--------|
| `frontend/src/App.jsx` | Modified | Core rewrite — routing, motion, cart persistence context, all 13 route definitions, 5 new component imports |
| `frontend/src/main.jsx` | Modified | BrowserRouter wrapper (required by App.jsx `<Routes>`) |
| `frontend/src/components/HomeCatalog.jsx` | Modified | Home catalog with inventory data + Party Builder nav trigger |
| `frontend/src/components/HomeCatalog.css` | Modified | Premium card + responsive image styles, token definitions |
| `frontend/src/components/ProductDetail.jsx` | Modified | "What's Included" panel + motion polish + image handling |
| `frontend/src/components/CheckoutView.jsx` | Modified | Checkout extras integration + image thumb handling |
| `frontend/src/components/OrderConfirmation.jsx` | Modified | Order confidence UX polish |
| `frontend/src/components/OrderTracking.jsx` | Modified | Public tracking timeline UI |
| `frontend/src/components/AccountView.jsx` | **New** | `/account` route — guest profile + orders |
| `frontend/src/components/SupportHelp.jsx` | **New** | `/support` route — help content |
| `frontend/src/components/OrderDetailsView.jsx` | **New** | `/order-details` route — order detail view |
| `frontend/src/components/PartyBuilder.jsx` | **New** | `/party-builder` route — multi-pack builder |
| `frontend/src/components/ExtrasAddOns.jsx` | **New** | `/extras` route — checkout add-ons |
| `frontend/src/styles.css` | Modified | Global CSS + `--label-sm` token fixes from fe-030 |

### Dependency declarations (must include):
| File | Reason |
|------|--------|
| `frontend/package.json` | Added `motion` ^12.40.0 and `react-router-dom` ^7.17.0 — required by new source code |
| `frontend/package-lock.json` | Lockfile must match package.json for reproducible builds |

### Documentation (optional but recommended):
| File | Reason |
|------|--------|
| `ai_context/11-QWEN-REPORTS/FRONTEND_QA_REPORT.md` | Full QA coverage of all customer views/routes/components |
| `ai_context/11-QWEN-REPORTS/FE-032-precommit-stabilization-review.md` | This block's own review (FE-032) |
| `ai_context/11-QWEN-REPORTS/fe-030-final-qa-css-cleanup.md` | Documents the 4 CSS token fixes applied |
| `ai_context/11-QWEN-REPORTS/fe-016-product-detail-whats-included.md` | Maps to ProductDetail.jsx changes |
| `ai_context/11-QWEN-REPORTS/fe-024-home-account-support.md` | Maps to AccountView + SupportHelp |
| `ai_context/11-QWEN-REPORTS/fe-028-extras-linking-flow-qa.md` | Maps to ExtrasAddOns |

## 5. Recommended Exclude File List (Group B)

Do NOT include these in the frontend commit. These belong on separate branches or should not be committed at all.

### Infrastructure / Deploy (separate branch):
| File | Reason |
|------|--------|
| `ai_context/11-QWEN-REPORTS/cf-001-cloudflare-stable-url-plan.md` | Cloudflare Tunnel deploy plan — infrastructure, not frontend |
| `ai_context/11-QWEN-REPORTS/deploy-002-rpi-image-readiness.md` | Raspberry Pi Docker image readiness — infrastructure |
| `ai_context/24-CLOUDFLARE-STABLE-URL-PLAN.md` | Cloudflare stable URL plan — infrastructure |
| `ai_context/RASPBERRY_DEPLOY_PROTOCOLS.md` | Deploy protocols — infra, not frontend code |

### Feature reports resolved into code (obsolete):
| File | Reason |
|------|--------|
| `ai_context/11-QWEN-REPORTS/fe-011a-modern-route-navigation.md` | Implementation plan for routing migration — superseded by App.jsx code |
| `ai_context/11-QWEN-REPORTS/fe-011b-modern-motion-polish.md` | Motion strategy plan — superseded by motion/react in App.jsx |
| `ai_context/11-QWEN-REPORTS/fe-011b2-motion-review-fixes.md` | Fixed — resolved in code |
| `ai_context/11-QWEN-REPORTS/fe-011b3-product-detail-motion-regression-fixes.md` | Fixed — resolved in code |
| `ai_context/11-QWEN-REPORTS/fe-012a-cart-persistence.md` | Implementation plan for localStorage cart — superseded by code |
| `ai_context/11-QWEN-REPORTS/fe-012b-checkout-validation-hardening.md` | Fixed — resolved in code |
| `ai_context/11-QWEN-REPORTS/fe-012c-manual-payment-instructions-ux.md` | Fixed — resolved in code |
| `ai_context/11-QWEN-REPORTS/fe-012d-public-tracking-timeline.md` | Fixed — resolved in code (OrderTracking.jsx) |
| `ai_context/11-QWEN-REPORTS/fe-012e-core-business-review-fixes.md` | Fixed — resolved in code |
| `ai_context/11-QWEN-REPORTS/fe-013*` (6 files: fe-013*, fe-013a-f*) | Full inventory reports — superseded by current working state |
| `ai_context/11-QWEN-REPORTS/fe-014a-style-token-inventory.md` | Style audit — supersedes actual CSS work in styles.css + HomeCatalog.css |
| `ai_context/11-QWEN-REPORTS/fe-017-product-detail-experience-polish.md` | Fixed — resolved in code (ProductDetail.jsx) |
| `ai_context/11-QWEN-REPORTS/fe-018-product-detail-cart-polish.md` | Fixed — resolved in code |
| `ai_context/11-QWEN-REPORTS/fe-019-product-cart-cleanup.md` | Superseded by current cart + routing restructure |
| `ai_context/11-QWEN-REPORTS/fe-020-checkout-experience-polish.md` | Fixed — resolved in code (CheckoutView.jsx) |
| `ai_context/11-QWEN-REPORTS/fe-021-order-confidence-polish.md` | Fixed — resolved in code (OrderConfirmation.jsx) |
| `ai_context/11-QWEN-REPORTS/fe-022-home-positioning-polish.md` | Superseded by current HomeCatalog changes |
| `ai_context/11-QWEN-REPORTS/fe-023-catalog-search-card-details.md` | Superseded by current HomeCatalog changes |
| `ai_context/11-QWEN-REPORTS/fe-025-fe024-build-fix.md` | Resolved in code — doc obsolete |
| `ai_context/11-QWEN-REPORTS/fe-026-order-details-party-builder-mobile-qa.md` | Maps to new components but is QA report, not implementation log |
| `ai_context/11-QWEN-REPORTS/fe-027-fe026-navigation-copy-fix.md` | Fixed — resolved in code |
| `ai_context/11-QWEN-REPORTS/fe-029-checkout-extras-qa.md` | Maps to ExtrasAddOns but is QA report, not implementation log |
| `ai_context/11-QWEN-REPORTS/assets-001-local-png-deploy.md` | Asset deployment plan — superseded by actual mojito.png in tree |

### Documentation / meta:
| File | Reason |
|------|--------|
| `ai_context/11-QWEN-REPORTS/FE-031-final-qa-reports.md` | Documentation-only QA corrections, zero code changes — lower priority |
| `ai_context/11-QWEN-REPORTS/fe-031-final-qa-report-corrections.md` | Companion to above — documentation only |
| `ai_context/11-QWEN-REPORTS/FRONTEND_BRANCH_STABILIZATION_REPORT.md` | Branch state doc — useful but not required for commit message context (already covered by FE-032) |

## 6. Files Needing User Decision (Group C)

These files have legitimate arguments for inclusion or exclusion and require explicit user choice.

| File | Arguments Include | Arguments Exclude |
|------|-------------------|-------------------|
| `ai_context/19-FRONTEND-EXECUTION-PLAN.md` | Part of working context; reflects updated plan for this iteration | It's meta-doc, not source code; may be outdated after commit |
| `ai_context/20-FRONTEND-QWEN-PROMPTS.md` | 629-line addition — prompts are part of AI workflow for this project | Meta-doc, not frontend application code |
| `frontend/public/catalog/mojito.png` | Asset exists; could be served by Vite static folder for catalog images; referenced in fe-003 report's migration plan (WebP→PNG) | No direct import or imageUrl reference found in source code; if backend API provides image URLs, this file is redundant for frontend commit |
| `ai_context/11-QWEN-REPORTS/FE-031-final-qa-reports.md` | Documents QA corrections with zero changes — confirms code is clean | Documentation only, adds noise to commit scope (2 files) |
| `ai_context/11-QWEN-REPORTS/fe-011a-modern-route-navigation.md` | Major architecture decision documentation (routing migration) useful for future reviewers | Implementation plan superseded by actual code; 89 lines of pre-computation that is now obsolete |
| `ai_context/11-QWEN-REPORTS/fe-024-home-account-support.md` | Maps directly to AccountView.jsx + SupportHelp.jsx — provides rationale for the new views | Already covered by frontend source + FE-032 review |

**My recommendation on each:**
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md` → **Exclude** (meta, keep working tree clean)
- `ai_context/20-FRONTEND-QWEN-PROMPTS.md` → **Exclude** (meta, not app code)
- `frontend/public/catalog/mojito.png` → **Include** (safe to add; if unused by API it does nothing; could be required at deploy-time for catalog images)
- `FE-031-final-qa-reports.md` + `fe-031-final-qa-report-corrections.md` → **Exclude** (doc only, low signal)
- `fe-011a-modern-route-navigation.md` → **Exclude** (implementation plan, superseded)

## 7. New Component Reference Verification

All 5 new components confirmed via App.jsx inspection:

### AccountView.jsx
| Check | Status | Evidence |
|-------|--------|----------|
| Imported in App.jsx | ✓ | Line 11: `import AccountView from './components/AccountView'` |
| Has route | ✓ | `<Route path="/account" element={<PageTransition><AccountView order={app.orderResponse || null} /></PageTransition}>` |
| Should include? | **YES** | Complete with import + route + prop contract |

### SupportHelp.jsx
| Check | Status | Evidence |
|-------|--------|----------|
| Imported in App.jsx | ✓ | Line 12: `import SupportHelp from './components/SupportHelp'` |
| Has route | ✓ | `<Route path="/support" element={<PageTransition><SupportHelp /></PageTransition}>` |
| Should include? | **YES** | Complete with import + route |

### OrderDetailsView.jsx
| Check | Status | Evidence |
|-------|--------|----------|
| Imported in App.jsx | ✓ | Line 13: `import OrderDetailsView from './components/OrderDetailsView'` |
| Has route or navigation | ✓ | `<Route path="/order-details" element={<OrderDetailsView order={app.orderResponse || null} onBackToCatalog={() => navigate('/')} />}>` |
| Should include? | **YES** | Complete with import + route + prop contract |

### PartyBuilder.jsx
| Check | Status | Evidence |
|-------|--------|----------|
| Imported in App.jsx | ✓ | Line 14: `import PartyBuilder from './components/PartyBuilder'` |
| Has route | ✓ | `<Route path="/party-builder" element={<PageTransition><PartyBuilder onBrowseCatalog={() => navigate('/')} /></PageTransition}>` |
| Used as navigation prop | ✓ | HomeCatalog.jsx line 205-208: party builder CTA button passes `onNavigatePartyBuilder={() => navigate('/party-builder')}` |
| Should include? | **YES** | Complete with import + route + cross-component usage |

### ExtrasAddOns.jsx
| Check | Status | Evidence |
|-------|--------|----------|
| Imported in App.jsx | ✓ | Line 15: `import ExtrasAddOns from './components/ExtrasAddOns'` |
| Has route / navigation path | ✓ | `<Route path="/extras" element={<PageTransition><ExtrasAddOns /></PageTransition}>` |
| Should include? | **YES** | Complete with import + route; maps to fe-028/fe-029 QA evidence |

### mojito.png reference verification
| Check | Result | Evidence |
|-------|--------|----------|
| Direct import in JSX/JS | No match | grep for `mojito` in `frontend/src/` returned zero results |
| Used as `src=` path (e.g. `/catalog/mojito.png`) | No direct reference | Image URLs all come via `product.image` from API response |
| Exists in public/catalog/ | ✓ | `frontend/public/catalog/mojito.png` is present |
| Likely purpose | Catalog product image asset served statically at runtime | The backend catalog API (`/public/${tenantSlug}/catalog/`) returns products with image URLs; this file could be served as a static fallback when the API provides `/catalog/mojito.png` paths |

**Classification for mojito.png: INCLUDE (safe addition)** — No harm in including a public asset that may serve at runtime. Even if unused today, it's needed for catalog image deployment and matches the migration plan documented in fe-003 report.

## 8. Suggested Exact `git add` Command (DO NOT RUN — Human Execution Only)

```bash
git add \
  frontend/src/App.jsx \
  frontend/src/main.jsx \
  frontend/src/components/HomeCatalog.jsx \
  frontend/src/components/HomeCatalog.css \
  frontend/src/components/ProductDetail.jsx \
  frontend/src/components/CheckoutView.jsx \
  frontend/src/components/OrderConfirmation.jsx \
  frontend/src/components/OrderTracking.jsx \
  frontend/src/components/AccountView.jsx \
  frontend/src/components/SupportHelp.jsx \
  frontend/src/components/OrderDetailsView.jsx \
  frontend/src/components/PartyBuilder.jsx \
  frontend/src/components/ExtrasAddOns.jsx \
  frontend/src/styles.css \
  frontend/package.json \
  frontend/package-lock.json \
  frontend/public/catalog/mojito.png \
  ai_context/11-QWEN-REPORTS/FRONTEND_QA_REPORT.md \
  ai_context/11-QWEN-REPORTS/FE-032-precommit-stabilization-review.md \
  ai_context/11-QWEN-REPORTS/fe-030-final-qa-css-cleanup.md \
  ai_context/11-QWEN-REPORTS/fe-016-product-detail-whats-included.md \
  ai_context/11-QWEN-REPORTS/fe-024-home-account-support.md \
  ai_context/11-QWEN-REPORTS/fe-028-extras-linking-flow-qa.md
```

**Total: 23 files** — 14 source/deps + 1 asset + 8 documentation files.

### Suggested commit message (human-written):
```
feat(frontend): migrate to react-router-dom v7, add 5 new views

- Migrate routing from useState-based view switching to react-router-dom v7
  with URL-backed <Routes>/<Route> and useNavigate/useParams hooks
- Add motion/page transition animations with spring physics + reduced-motion support
- Implement localStorage cart persistence with schema normalization
- Add AppStateCtx context provider for shared state across route transitions

New views:
- /account (AccountView) — guest profile + order history
- /support (SupportHelp) — help content
- /order-details (OrderDetailsView) — detailed order page
- /party-builder (PartyBuilder) — multi-pack party builder
- /extras (ExtrasAddOns) — checkout extras add-ons

Other:
- Add mojito.png product asset to public/catalog/
- Fix 4 undefined CSS custom properties (--label-sm and variants)
- Add motion + react-router-dom v7 to package dependencies
```

## 9. Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | Not all route paths verified — one or more of the 13 routes may have mismatched paths or missing element props | High | Human must verify every `<Route path="...">` in App.jsx has an import + matching component/element |
| 2 | BrowserRouter wrapper could conflict with any remaining state-based view switching patterns | Medium | Audit all components for residual `setView` / state-based navigation that may conflict with router hooks |
| 3 | Spring animation performance on low-end Android devices | Medium | Test `stiffness:400, damping:32` settings on target device; verify `useReducedMotion` fallback works |
| 4 | localStorage cart data migration silently drops old cart entries via `normalizeCartItem` validation | Low | Document as known upgrade behavior in commit message |
| 5 | 21 untracked reports remain after commit — future contributors may be confused by noise | Low | Archive obsolete reports post-commit; mark clearly in FE-032 review |

## Suggested Next Action

1. Human reviews the file lists above and makes decisions on Group C items (8 files needing choice)
2. Human runs the `git add` command (with any modifications from Group C decisions)
3. Human writes final commit message (suggested template provided above, modify as needed)
4. After commit, archive or remove obsolete reports in `ai_context/11-QWEN-REPORTS/`

---

*Generated as part of task block FE-033 — Commit Scope Proposal.*
*No source code modified. No files staged. All dirty working tree state preserved.*
