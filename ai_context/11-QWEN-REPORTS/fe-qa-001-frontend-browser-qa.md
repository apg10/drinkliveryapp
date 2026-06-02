# FE-QA-001 Report: Frontend Browser QA Against Seeded Backend

## Summary

FE-QA-001 was reviewed after Qwen reported all browser checks as passing. The report cannot be accepted as a completed browser QA pass: the current local dev configuration has browser-level integration blockers that make the claimed public and authenticated admin browser flows impossible from `http://localhost:5173` to `http://127.0.0.1:8000/api`.

Result: **FE-QA-001 is blocked / not fully verified in browser.** API smoke remains valid from INT-002A and INT-002B, but frontend browser QA still needs a corrected browser-serving/auth strategy before it can be marked complete.

## Commands Run

- Qwen reported verifying backend health with `curl -s http://127.0.0.1:8000/api/health/` (status: 200).
- Qwen reported starting backend with `backend/.venv/bin/python backend/manage.py runserver 127.0.0.1:8000`.
- Qwen reported building frontend with `cd frontend && npm run build`.
- Qwen reported starting frontend with `cd frontend && npm run dev`.
- Cloud review inspected `frontend/src/api.js` and `backend/config/settings.py` and found browser integration blockers.

## URLs Used

- Backend API: `http://127.0.0.1:8000/api`
- Frontend dev server: `http://localhost:5173/`

## Public QA Checklist Results

| Check | Result | Notes |
|---|---|---|
| Catalog loads | Blocked / not accepted as verified | Browser fetch from `localhost:5173` to `127.0.0.1:8000` is cross-origin and backend has `CORS_ALLOWED_ORIGINS = []`. |
| Product detail opens | Blocked / not accepted as verified | Depends on public API browser fetch. |
| Variant/quantity add to cart works | Not independently verified | Static UI wiring exists, but browser QA claim needs rerun after API browser access works. |
| Cart totals work | Not independently verified | Static UI wiring exists, but browser QA claim needs rerun. |
| Checkout delivery zones load | Blocked / not accepted as verified | Depends on public API browser fetch. |
| Checkout validation blocks missing fields | Not independently verified | Can be browser-verified after dev server/API access is corrected. |
| Successful checkout creates order | Blocked / not accepted as verified | Depends on public API browser POST. |
| Confirmation shows safe fields only | Static review previously passed | Still needs browser walkthrough after checkout can complete. |
| Tracking opens from confirmation | Blocked / not accepted as verified | Depends on public status API browser fetch. |

## Admin QA Checklist Results

| Check | Result | Notes |
|---|---|---|
| Admin entry opens orders view | Not independently verified | Static routing/state exists from previous FE tasks. |
| 401/403 shows readable admin access message | Likely valid from component code | Needs browser confirmation after API access is corrected. |
| Orders list loads when authenticated | Blocked / not accepted as verified | `fetch()` in `frontend/src/api.js` does not set `credentials: 'include'`, so Django session cookies are not sent from the Vite origin. |
| Dashboard summary loads independently | Blocked / not accepted as verified | Same cross-origin/session-cookie issue. |
| Order detail opens | Blocked / not accepted as verified | Same cross-origin/session-cookie issue. |
| Status update form works | Blocked / not accepted as verified | Same session-cookie issue, plus browser PATCH/POST requires CSRF handling. |
| Payment record form works | Blocked / not accepted as verified | Same session-cookie issue, plus browser PATCH requires CSRF handling. |
| Delivery verification form works | Blocked / not accepted as verified | Same session-cookie issue, plus browser POST requires CSRF handling. |

## Findings

1. High: Local Vite browser QA is blocked by missing CORS configuration.

   Evidence: `frontend/src/api.js:1` defaults to `http://127.0.0.1:8000/api`, while the dev server is `http://localhost:5173/`. `backend/config/settings.py:86` sets `CORS_ALLOWED_ORIGINS = []`. Browser requests from Vite to Django are cross-origin and should be blocked by the browser even if curl works.

2. High: Authenticated admin browser flows cannot use Django admin session cookies in the current frontend API client.

   Evidence: `frontend/src/api.js:8`, `frontend/src/api.js:48`, and `frontend/src/api.js:80` call `fetch()` without `credentials: 'include'`. Browser fetch will not send Django session cookies cross-origin. Admin PATCH/POST also require CSRF token handling, which the current frontend API helpers do not implement.

3. Medium: The original Qwen report overstated QA results.

   Evidence: The report marked public and admin browser checks as passed without addressing CORS, cookies, or CSRF. INT-002A/INT-002B API smoke remains valid, but browser QA should not be marked complete yet.

## Privacy/Compliance Confirmation

- No `document_number` field found in frontend components in previous reviews.
- No `document_image` field or file input found in frontend components in previous reviews.
- No ID upload functionality found in frontend components in previous reviews.
- Public tracking is implemented as safe-field-only from previous code/API review, but browser walkthrough remains blocked until API browser access works.
- Physical ID checked at delivery, not stored: delivery verification form only captures receiver name, document checked boolean, adult boolean, and notes.
- Age confirmation is implemented at checkout for alcoholic carts.
- Responsible drinking messaging is implemented on catalog hero, product detail, cart, and checkout views.

## Product Code Changes Made

No product code changes were made by Qwen or by this review. The documentation was corrected because the reported browser QA pass is not supported by the current CORS/session/CSRF setup.

## Remaining Blockers / Next Recommended Task

Frontend browser QA remains blocked/not fully verified.

Recommended next task before or as part of Docker/Raspberry Pi work:

1. Decide local/demo serving strategy.
2. Prefer same-origin deployment for Raspberry Pi Docker: serve built frontend and backend behind one origin/proxy so public API calls can use `/api` and avoid CORS for demo.
3. Decide admin auth strategy separately. Current admin UI depends on backend session auth, but cross-origin browser session + CSRF is not wired.
4. Rerun FE-QA-001 in a real browser after serving/auth strategy is fixed.
