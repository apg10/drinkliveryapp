# Block Execution Plan

## Purpose

Drinklivery will be implemented by local AI in small blocks of microtasks.

Each microtask remains narrow and controlled. Each microtask is executed in its own local AI chat/session to avoid context problems. Codex/OpenCode review happens at the block boundary instead of after every single task. This reduces review overhead while keeping changes manageable.

## Rules

1. Qwen/local AI executes exactly one microtask per chat/session.
2. Blocks define the group of microtasks we review together.
3. Qwen/local AI must create one report per microtask.
4. Qwen/local AI must run the required tests for each microtask.
5. Qwen/local AI must not start the next microtask in the same chat.
6. After all microtasks in a block are complete, run one separate block-summary chat.
7. Codex/OpenCode reviews the whole block before the next block starts.
8. If a task hits a stop condition, Qwen/local AI must stop and report.
9. Compliance-sensitive failures stop the block immediately.

## Block Report Format

The block report is created in a separate local AI chat after all microtasks in the block are complete.

Create a report at:

`ai_context/11-QWEN-REPORTS/BLOCK-{number}-{short-name}.md`

The block report must include:

1. Block ID and title
2. Microtasks completed
3. Files changed by task
4. Tests run by task
5. Overall test result
6. Deviations from allowed scope, if any
7. Risks or unresolved questions
8. Whether the block is ready for Codex/OpenCode review

## Block 0: Planning

Status: Complete.

Scope:

- `ai_context/` planning files
- Architecture
- Endpoint matrix
- Test plan
- Worker protocol
- Task queue

No backend or frontend code.

## Block 1: Backend Foundation

Status: Ready for local AI.

Microtasks:

- `BE-001`: Initialize Django backend skeleton with health endpoint
- `BE-002`: Add tenants app foundation

Goal:

- Establish a working Django backend.
- Confirm pytest works.
- Add the minimum tenant foundation for future marketplace isolation.

Review boundary:

- Review after `BE-001` and `BE-002` are complete and reports exist.

Expected final command:

- `cd backend`
- `pytest`

Block report:

- `ai_context/11-QWEN-REPORTS/BLOCK-1-backend-foundation.md`

Execution chats:

- Chat 1: `BE-001`
- Chat 2: `BE-002`
- Chat 3: Block 1 summary report only

## Block 2: Public Catalog And Delivery Surface

Status: Do not start until Block 1 is reviewed.

Microtasks:

- `BE-003`: Add product catalog models
- `BE-004`: Add public catalog endpoint
- `BE-005`: Add public product detail endpoint
- `BE-006`: Add delivery zones

Goal:

- Create tenant-scoped catalog models.
- Expose active public catalog data.
- Expose active delivery zones.

Review boundary:

- Review after `BE-003` through `BE-006` are complete and reports exist.

Expected final command:

- `cd backend`
- `pytest`

Block report:

- `ai_context/11-QWEN-REPORTS/BLOCK-2-catalog-delivery.md`

Execution chats:

- Chat 1: `BE-003`
- Chat 2: `BE-004`
- Chat 3: `BE-005`
- Chat 4: `BE-006`
- Chat 5: Block 2 summary report only

## Block 3: Checkout Foundation

Status: Do not start until Block 2 is reviewed.

Microtasks:

- `BE-007`: Add orders foundation
- `BE-008`: Add public checkout endpoint
- `BE-009`: Add alcohol age confirmation checkout rules

Goal:

- Create customer, address, order, item, and status history foundations.
- Implement public checkout.
- Enforce age confirmation and terms acceptance.

Review boundary:

- Review after `BE-007` through `BE-009` are complete and reports exist.

Expected final command:

- `cd backend`
- `pytest`

Block report:

- `ai_context/11-QWEN-REPORTS/BLOCK-3-checkout-foundation.md`

Execution chats:

- Chat 1: `BE-007`
- Chat 2: `BE-008`
- Chat 3: `BE-009`
- Chat 4: Block 3 summary report only

## Block 4: Status, Public Tracking, Payments, And Compliance

Status: Do not start until Block 3 is reviewed.

Microtasks:

- `BE-010`: Add order status transition history
- `BE-011`: Add public order status endpoint
- `BE-012`: Add manual payment records
- `BE-013`: Add compliance delivery verification

Goal:

- Make order status transitions auditable.
- Expose safe public status tracking.
- Add manual payment records.
- Add delivery verification and failed age verification workflow.

Review boundary:

- Review after `BE-010` through `BE-013` are complete and reports exist.

Expected final command:

- `cd backend`
- `pytest`

Block report:

- `ai_context/11-QWEN-REPORTS/BLOCK-4-status-payments-compliance.md`

Execution chats:

- Chat 1: `BE-010`
- Chat 2: `BE-011`
- Chat 3: `BE-012`
- Chat 4: `BE-013`
- Chat 5: Block 4 summary report only

## Block 5: Admin Operations

Status: Do not start until Block 4 is reviewed.

Microtasks:

- `BE-014`: Add admin order endpoints
- `BE-015`: Add dashboard summary

Goal:

- Give the operator basic order management APIs.
- Provide basic operational metrics.

Review boundary:

- Review after `BE-014` and `BE-015` are complete and reports exist.

Expected final command:

- `cd backend`
- `pytest`

Block report:

- `ai_context/11-QWEN-REPORTS/BLOCK-5-admin-operations.md`

Execution chats:

- Chat 1: `BE-014`
- Chat 2: `BE-015`
- Chat 3: Block 5 summary report only

## Block 6: Seed Data And Deployment Preparation

Status: Do not start until Block 5 is reviewed.

Microtasks:

- `BE-016`: Add seed data
- `BE-017`: Prepare deployment docs and environment notes

Goal:

- Add initial Drinklivery Panama data.
- Prepare the backend for demo/staging decisions without overengineering infrastructure.

Review boundary:

- Review after `BE-016` and `BE-017` are complete and reports exist.

Expected final command:

- `cd backend`
- `pytest`

Block report:

- `ai_context/11-QWEN-REPORTS/BLOCK-6-seed-deploy-prep.md`

Execution chats:

- Chat 1: `BE-016`
- Chat 2: `BE-017`
- Chat 3: Block 6 summary report only

## Current Assignment

The first assignable local AI block is:

`BLOCK-1: Backend Foundation`

Allowed microtasks:

- `BE-001`
- `BE-002`

Do not assign Block 2 until Block 1 is reviewed.
