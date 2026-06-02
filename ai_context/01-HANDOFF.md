# Drinklivery Handoff

## Status

Backend MVP endpoints and the frontend MVP flow are implemented through the current public checkout/tracking and admin order operations scope.

Frontend MVP is complete (FE-001 through FE-009) and ready for demo/staging QA against a running backend with seeded data.

INT-002A and INT-002B live smoke are complete: backend environment bootstrapped, 203 backend tests passed, migrations/seed ran, frontend build passed, public endpoints P1-P6 passed, and admin endpoints A1-A9 passed with Django session auth. Frontend browser QA remains pending.

## Frontend Status

Full frontend MVP is complete through FE-009 (Demo Readiness QA Handoff).

Completed and verified:

- **FE-001 through FE-003A**: React + Vite skeleton, API client, public catalog fetch/display, product detail view, in-memory cart state and cart view.
- **FE-004A through FE-004D**: Checkout view shell, delivery-zone fetch/display/select, selected-zone checkout totals, checkout submission via `POST /public/{tenant_slug}/orders/`, order confirmation, checkout review cleanup.
- **FE-005A**: Public order tracking with `GET /public/{tenant_slug}/orders/{order_code}/status/`, safe fields only.
- **FE-006A through FE-006D**: Admin API helpers, admin orders list with loading/error/empty/401-403 states, admin order detail view, admin dashboard summary with independent loading.
- **FE-007A through FE-007D**: Admin mutation API helpers (status, payment, delivery verification), admin action UI panels (status update, payment recording, delivery verification) with submitting/error/success states.
- **FE-008**: MVP end-to-end review hardening. Fixed missing `OTHER_MANUAL` payment option in public checkout.
- **FE-009**: Demo/staging QA readiness, documentation updates, compliance confirmation, build verification.

Not implemented (out of scope for MVP):

- Admin login UI, token storage, or auth flows (admin access relies entirely on backend session).
- Product admin (CRUD). Only admin read/mutation endpoints for orders are present.
- Payment gateway integration.
- WhatsApp API integration.
- Sensitive ID document storage or upload (document_number, document_image remain out of scope).

## What Local AI Must Read Before Coding

Required context:

- `ai_context/00-PLAN.md`
- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/04-APP-BRIEF.md`
- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/08-MVP-SCOPE.md`
- `ai_context/09-LOCAL-MODEL-TASK-QUEUE.md`
- `ai_context/13-ARCHITECTURE.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/15-TEST-PLAN.md`
- `ai_context/19-FRONTEND-EXECUTION-PLAN.md`
- `ai_context/20-FRONTEND-QWEN-PROMPTS.md`

## Current Recommended Next Work

Do not restart the original backend foundation blocks. Those were historical implementation steps.

Recommended next work:

1. Verify the frontend QA checklist in `frontend/README.md` against a running seeded backend.
2. Decide the admin auth strategy before implementing any admin login UI or token handling.
3. Keep product admin out of scope until backend CRUD endpoints are implemented and approved.
4. Consider non-blocking cleanup/hardening only after browser QA is complete.

## Current Rules

- One task equals one intention.
- One block equals one review boundary.
- Do not modify files outside the task's allowed scope.
- Do not create frontend code during backend milestones.
- Do not add dependencies unless the task explicitly allows them.
- Do not implement Docker, Celery, Redis, Stripe, WhatsApp API, or native app code.
- Do not push to a remote.
- Do not commit unless explicitly instructed.
- Do not use `git add .`.
- Use GitHub only after the remote repository is explicitly configured.
