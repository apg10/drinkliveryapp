# Local AI Prompts

## How To Use

Use one prompt per local AI chat/session.

Do not ask the local AI to execute more than one microtask in the same chat.

After a microtask finishes, start a new chat for the next microtask.

## Prompt For BE-001

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-001.
Do not start BE-002 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/04-APP-BRIEF.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/06-COMPLIANCE-RULES.md
- ai_context/08-MVP-SCOPE.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md

Task:
Execute BE-001 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-001.
Do not create business models.
Do not create frontend code.
Do not add Docker, Celery, Redis, Stripe, WhatsApp API, or auth.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-001.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/001-backend-skeleton.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-001 scope.
```

## Prompt For BE-002

Use only after BE-001 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-002.
Do not start BE-003 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/07-DATA-MODEL-DRAFT.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/config/settings.py

Task:
Execute BE-002 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-002.
Do not create product, order, payment, compliance, notification, or frontend code.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-002.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/002-tenants-foundation.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-002 scope.
```

## Prompt For Block 1 Summary

Use only after BE-001 and BE-002 complete successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is only for the Block 1 summary report.
Do not modify backend code.
Do not implement any new task.

Read these files from disk:
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/10-CODEX-TASKS.md
- ai_context/11-QWEN-REPORTS/001-backend-skeleton.md
- ai_context/11-QWEN-REPORTS/002-tenants-foundation.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md

Task:
Create ai_context/11-QWEN-REPORTS/BLOCK-1-backend-foundation.md.

The report must include:
1. Block ID and title
2. Microtasks completed
3. Files changed by task
4. Tests run by task
5. Overall test result
6. Deviations from allowed scope, if any
7. Risks or unresolved questions
8. Whether the block is ready for Codex/OpenCode review

Allowed file to modify:
- ai_context/11-QWEN-REPORTS/BLOCK-1-backend-foundation.md
```
