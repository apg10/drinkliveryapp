# Codex/OpenCode Tasks And Review Checklist

## Codex/OpenCode Responsibilities

- Own architecture decisions.
- Keep local AI tasks narrow.
- Review Qwen/local AI output at block boundaries.
- Inspect per-task reports during block review.
- Inspect diffs before approving the next block.
- Run or verify tests.
- Update planning documents when decisions change.
- Reject scope creep.
- Enforce compliance-sensitive rules.
- Enforce Git/GitHub workflow rules.

## Block Review Rule

Codex/OpenCode reviews after each assigned block, not after every individual microtask.

During block review, inspect:

- All per-task reports in the block
- The block summary report
- The full diff for the block
- The final full test result
- Any scope deviations or risks

Do not approve the next block until the current block is clean.

## Review Checklist For Every Task

Use this checklist for each microtask while reviewing a completed block.

Before approving any local AI output, verify:

1. The task changed only allowed files.
2. No forbidden files were modified.
3. No unrelated refactor was introduced.
4. No unapproved dependency was added.
5. No frontend code was added during backend milestones.
6. No Docker, Celery, Redis, Stripe, or WhatsApp API code was added prematurely.
7. Tests were added or updated for backend behavior.
8. The required test command was run.
9. The report exists in `ai_context/11-QWEN-REPORTS/`.
10. Business rules remain intact.
11. Compliance rules remain intact.
12. No sensitive ID image/document storage was introduced.
13. No unauthorized commit, push, branch, remote, or broad staging was performed.

## Git Review Checklist

Before committing a reviewed block:

1. Run `git status --short`.
2. Inspect the diff.
3. Confirm no secrets, `.env`, local database, virtual environment, cache, or generated junk is staged.
4. Run the relevant final tests.
5. Stage files explicitly.
6. Use a concise commit message.
7. Do not push unless Adrian approves.

## BE-001 Review Checklist

- `backend/` exists with expected Django structure.
- `rest_framework` is configured.
- `corsheaders` is configured.
- `pytest.ini` exists.
- `GET /api/health/` returns status code 200.
- Health response contains `status: ok`.
- Health response contains `service: drinklivery-backend`.
- No business models were added.
- No frontend code was added.
- Tests pass with `pytest` from `backend/`.

## BE-002 Review Checklist

- Tenants app exists.
- Tenant model has required fields.
- StorefrontSettings model has required fields.
- OperatingSchedule model has required fields.
- Admin registration exists.
- Migrations exist.
- Model tests pass.
- No product/order/payment/compliance code was added.

## BE-003 Review Checklist

- Products app exists.
- Category, Product, ProductVariant models exist.
- Tenant relationships are correct.
- Active flags and display order exist.
- Admin registration exists.
- Migrations exist.
- Model tests pass.

## BE-004 And BE-005 Review Checklist

- Public catalog and product detail endpoints match endpoint matrix.
- Inactive records are excluded.
- Tenant isolation is tested.
- Unknown tenant behavior is 404.
- Public serializers do not expose internal fields.

## BE-006 Review Checklist

- DeliveryZone model exists.
- Active zones endpoint exists.
- Tenant isolation is tested.
- Admin registration exists.

## BE-007 Through BE-010 Review Checklist

- Order models match data model decisions.
- Order statuses match business rules.
- Checkout calculations are tested.
- Alcohol age confirmation is enforced.
- Terms acceptance is enforced.
- Status history is created through the approved helper/service.
