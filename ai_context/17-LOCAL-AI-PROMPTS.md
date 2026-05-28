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

## Prompt For BE-003

Use only after Block 1 has been reviewed and approved.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-003.
Do not start BE-004 or any other task in this chat.

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
- backend/apps/tenants/models.py

Task:
Execute BE-003 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-003.
Do not create order, delivery, payment, compliance, notification, or frontend code.
Do not create public API endpoints yet; BE-004 and BE-005 cover that.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-003.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/003-product-catalog-models.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-003 scope.
```

## Prompt For BE-004

Use only after BE-003 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-004.
Do not start BE-005 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/config/urls.py
- backend/apps/tenants/models.py
- backend/apps/products/models.py

Task:
Execute BE-004 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-004.
Do not create order, payment, compliance, notification, admin API, or frontend code.
Do not implement product detail endpoint; BE-005 covers that.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-004.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/004-public-catalog-endpoint.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-004 scope.
```

## Prompt For BE-005

Use only after BE-004 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-005.
Do not start BE-006 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/products/models.py
- backend/apps/products/serializers.py
- backend/apps/products/views.py
- backend/apps/products/urls.py

Task:
Execute BE-005 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-005.
Do not create order, delivery, payment, compliance, notification, admin API, or frontend code.
Do not modify product models unless you stop and explain why it is required.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-005.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/005-public-product-detail.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-005 scope.
```

## Prompt For BE-006

Use only after BE-005 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-006.
Do not start BE-007 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/07-DATA-MODEL-DRAFT.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/config/settings.py
- backend/config/urls.py
- backend/apps/tenants/models.py

Task:
Execute BE-006 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-006.
Do not create order, payment, compliance, notification, admin API, or frontend code.
Do not implement checkout; BE-008 covers that later.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-006.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/006-delivery-zones.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-006 scope.
```

## Prompt For Block 2 Summary

Use only after BE-003, BE-004, BE-005, and BE-006 complete successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is only for the Block 2 summary report.
Do not modify backend code.
Do not implement any new task.

Read these files from disk:
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/10-CODEX-TASKS.md
- ai_context/11-QWEN-REPORTS/003-product-catalog-models.md
- ai_context/11-QWEN-REPORTS/004-public-catalog-endpoint.md
- ai_context/11-QWEN-REPORTS/005-public-product-detail.md
- ai_context/11-QWEN-REPORTS/006-delivery-zones.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md

Task:
Create ai_context/11-QWEN-REPORTS/BLOCK-2-catalog-delivery.md.

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
- ai_context/11-QWEN-REPORTS/BLOCK-2-catalog-delivery.md
```

## Prompt For BE-007

Use only after Block 2 has been reviewed and approved.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-007.
Do not start BE-008 or any other task in this chat.

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
- backend/apps/tenants/models.py
- backend/apps/products/models.py
- backend/apps/delivery/models.py

Task:
Execute BE-007 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-007.
Do not create checkout endpoint code; BE-008 covers that.
Do not create payment app, compliance app, notification app, admin API, or frontend code.
Do not implement payment gateways.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-007.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/007-orders-foundation.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-007 scope.
```

## Prompt For BE-008

Use only after BE-007 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-008.
Do not start BE-009 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/06-COMPLIANCE-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/config/urls.py
- backend/apps/tenants/models.py
- backend/apps/products/models.py
- backend/apps/delivery/models.py
- backend/apps/orders/models.py

Task:
Execute BE-008 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-008.
Do not implement age confirmation or terms enforcement beyond storing fields already present; BE-009 covers those rules.
Do not create payment app, compliance app, notification app, admin API, or frontend code.
Do not implement payment gateways or WhatsApp API.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-008.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/008-public-checkout.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-008 scope.
```

## Prompt For BE-009

Use only after BE-008 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-009.
Do not start BE-010 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/06-COMPLIANCE-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/products/models.py
- backend/apps/orders/models.py
- backend/apps/orders/serializers.py
- backend/apps/orders/services.py
- backend/apps/orders/views.py

Task:
Execute BE-009 exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-009.
Do not create compliance app or delivery verification code; later tasks cover that.
Do not store ID images, document images, document numbers, or sensitive ID data.
Do not create payment app, notification app, admin API, or frontend code.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-009.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- The task would require storing sensitive ID data.
- Tests fail and cannot be fixed within BE-009 scope.
```

## Prompt For Block 3 Summary

Use only after BE-007, BE-008, and BE-009 complete successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is only for the Block 3 summary report.
Do not modify backend code.
Do not implement any new task.

Read these files from disk:
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/10-CODEX-TASKS.md
- ai_context/11-QWEN-REPORTS/007-orders-foundation.md
- ai_context/11-QWEN-REPORTS/008-public-checkout.md
- ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md

Task:
Create ai_context/11-QWEN-REPORTS/BLOCK-3-checkout-foundation.md.

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
- ai_context/11-QWEN-REPORTS/BLOCK-3-checkout-foundation.md
```
