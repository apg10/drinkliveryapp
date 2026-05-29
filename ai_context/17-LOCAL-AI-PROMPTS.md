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
Do not start BE-009A or any other task in this chat.

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
Do not implement age confirmation or terms enforcement beyond storing fields already present; BE-009A and BE-009B cover those rules.
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

## Prompt For BE-009A

Use only after BE-008 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-009A.
Do not start BE-009B or any other task in this chat.

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
- backend/apps/orders/models.py
- backend/apps/orders/serializers.py
- backend/apps/orders/services.py
- backend/apps/orders/views.py

Task:
Execute BE-009A exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-009A.
Only enforce terms acceptance in this chat.
Do not implement age confirmation logic; BE-009B covers that.
Do not create payment app, notification app, admin API, or frontend code.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-009A.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/009a-terms-acceptance.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- Tests fail and cannot be fixed within BE-009A scope.
```

## Prompt For BE-009B

Use only after BE-009A completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-009B.
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
Execute BE-009B exactly as specified in ai_context/09-LOCAL-MODEL-TASK-QUEUE.md.

Scope:
Only modify files allowed under BE-009B.
Only enforce age confirmation for alcoholic carts in this chat.
Do not create compliance app or delivery verification code; later tasks cover that.
Do not store ID images, document images, document numbers, or sensitive ID data.
Do not create payment app, notification app, admin API, or frontend code.
Do not commit.
Do not push.
Do not use git add .

Required output:
- Implement BE-009B.
- Run the required tests.
- Update ai_context/02-LOG.md.
- Create ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md.

Stop and report if:
- You need to edit a forbidden file.
- A required dependency or architecture decision is unclear.
- The task would require storing sensitive ID data.
- Tests fail and cannot be fixed within BE-009B scope.
```

## Prompt For Block 3 Summary

Use only after BE-007, BE-008, BE-009A, and BE-009B complete successfully.

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
- ai_context/11-QWEN-REPORTS/009a-terms-acceptance.md
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

## Prompt For BE-010

Use only after Block 3 has been reviewed and approved.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-010.
Do not start BE-011A or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/orders/models.py
- backend/apps/orders/services.py

Task:
Add a small order status transition helper/service.

Scope:
Only modify:
- backend/apps/orders/services.py
- backend/apps/orders/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/010-order-status-history.md

Implementation requirements:
- Add `transition_order_status(order, new_status, changed_by='', note='')` in `backend/apps/orders/services.py`.
- If `new_status` equals current status, do not create history and return the order unchanged.
- If status changes, create `OrderStatusHistory` with previous status, new status, changed_by, and note.
- Save the new status on the order.
- Keep transition rules minimal; do not enforce a full state machine yet.
- Do not create endpoints.
- Do not create payments, compliance, notifications, admin API, or frontend code.

Test requirements:
- Test status update changes order status.
- Test status update creates history.
- Test no history is created when status does not change.
- Test note and changed_by are stored.

Commands to run:
- cd backend
- python -m pytest apps/orders -q

Required report:
- ai_context/11-QWEN-REPORTS/010-order-status-history.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-011A

Use only after BE-010 completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-011A.
Do not start BE-012A or any other task in this chat.

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
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py

Task:
Add the safe public order status endpoint.

Scope:
Only modify:
- backend/config/urls.py if needed
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/011a-public-order-status.md

Implementation requirements:
- Add `GET /api/public/{tenant_slug}/orders/{order_code}/status/`.
- Return only safe public fields: `order_code`, `status`, `scheduled_date`, `scheduled_time_window`, `total`.
- Return 404 for unknown tenant.
- Return 404 for unknown order.
- Enforce tenant isolation.
- Do not expose customer data, address, payment reference, admin notes, compliance notes, or internal user data.
- Do not create payments, compliance, notifications, admin API, or frontend code.

Test requirements:
- Active order status returns 200.
- Unknown tenant returns 404.
- Unknown order returns 404.
- Order from another tenant returns 404.
- Response contains safe fields only.

Commands to run:
- cd backend
- python -m pytest apps/orders -q

Required report:
- ai_context/11-QWEN-REPORTS/011a-public-order-status.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-012A

Use only after BE-011A completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-012A.
Do not start BE-012B or any other task in this chat.

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
- backend/apps/orders/models.py

Task:
Create the payments app foundation and PaymentRecord model only.

Scope:
Only modify:
- backend/config/settings.py
- backend/apps/payments/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/012a-payment-record-model.md

Implementation requirements:
- Create `apps.payments`.
- Add `PaymentRecord` model with: order, method, status, amount, reference, notes, confirmed_at, created_at, updated_at.
- Use order payment method/status choices where practical, or matching local choices without adding new dependencies.
- Register model in Django admin.
- Create migrations.
- Do not create payment gateway code.
- Do not create payment endpoints.
- Do not create admin API, compliance, notifications, or frontend code.

Test requirements:
- PaymentRecord can be created.
- PaymentRecord is related to an order.
- Optional reference and notes can be blank.
- String representation is useful.

Commands to run:
- cd backend
- python -m pytest apps/payments -q

Required report:
- ai_context/11-QWEN-REPORTS/012a-payment-record-model.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-012B

Use only after BE-012A completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-012B.
Do not start BE-013A or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/orders/models.py
- backend/apps/payments/models.py

Task:
Add a small manual payment record service.

Scope:
Only modify:
- backend/apps/payments/services.py
- backend/apps/payments/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/012b-manual-payment-service.md

Implementation requirements:
- Add a service/helper to create a manual `PaymentRecord` for an order.
- The service must update `order.payment_status` to the supplied payment status.
- Do not create API endpoints.
- Do not integrate Stripe, Yappy API, card processors, or external gateways.
- Do not create admin API, compliance, notifications, or frontend code.

Test requirements:
- Service creates a PaymentRecord.
- Service updates order.payment_status.
- Reference and notes are stored.
- Payment records are not exposed through public order status endpoint.

Commands to run:
- cd backend
- python -m pytest apps/payments apps/orders -q

Required report:
- ai_context/11-QWEN-REPORTS/012b-manual-payment-service.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-013A

Use only after BE-012B completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-013A.
Do not start BE-013B or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/06-COMPLIANCE-RULES.md
- ai_context/07-DATA-MODEL-DRAFT.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/config/settings.py
- backend/apps/orders/models.py

Task:
Create compliance models only.

Scope:
Only modify:
- backend/config/settings.py
- backend/apps/compliance/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/013a-compliance-models.md

Implementation requirements:
- Create `apps.compliance`.
- Add `DeliveryVerification` model with: order, receiver_name, receiver_document_checked, receiver_is_adult, verified_by, verification_notes, delivered_at, created_at.
- Add `ComplianceEvent` model with: order, event_type, notes, created_at.
- Register models in Django admin.
- Create migrations.
- Do not create delivery verification workflow yet.
- Do not store ID images, document images, document numbers, or sensitive ID data.
- Do not create endpoints, payment code, notifications, admin API, or frontend code.

Test requirements:
- DeliveryVerification can be created.
- ComplianceEvent can be created.
- Models relate to Order.
- No image/document fields exist on these models.

Commands to run:
- cd backend
- python -m pytest apps/compliance -q

Required report:
- ai_context/11-QWEN-REPORTS/013a-compliance-models.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-013B

Use only after BE-013A completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-013B.
Do not start BE-014A or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/06-COMPLIANCE-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/orders/models.py
- backend/apps/orders/services.py
- backend/apps/compliance/models.py

Task:
Add delivery verification service and failed age verification workflow.

Scope:
Only modify:
- backend/apps/compliance/services.py
- backend/apps/compliance/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/013b-delivery-verification-service.md

Implementation requirements:
- Add a service/helper to record delivery verification.
- If `receiver_document_checked=True` and `receiver_is_adult=True`, create DeliveryVerification and move order to `DELIVERED` using the order status transition helper.
- If document was not checked or receiver is not adult, create DeliveryVerification, create ComplianceEvent, and move order to `FAILED_AGE_VERIFICATION`.
- Do not store ID images, document images, document numbers, or sensitive ID data.
- Do not create endpoints.
- Do not create payment code, notifications, admin API, or frontend code.

Test requirements:
- Adult verified delivery marks order `DELIVERED`.
- Failed age/document verification marks order `FAILED_AGE_VERIFICATION`.
- DeliveryVerification stores receiver name, document checked flag, adult result, verifier, notes, and timestamp.
- ComplianceEvent is created for failed verification.
- No document image or document number fields are introduced.

Commands to run:
- cd backend
- python -m pytest apps/compliance apps/orders -q

Required report:
- ai_context/11-QWEN-REPORTS/013b-delivery-verification-service.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For Block 4 Summary

Use only after BE-010, BE-011A, BE-012A, BE-012B, BE-013A, and BE-013B complete successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is only for the Block 4 summary report.
Do not modify backend code.
Do not implement any new task.

Read these files from disk:
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/10-CODEX-TASKS.md
- ai_context/11-QWEN-REPORTS/010-order-status-history.md
- ai_context/11-QWEN-REPORTS/011a-public-order-status.md
- ai_context/11-QWEN-REPORTS/012a-payment-record-model.md
- ai_context/11-QWEN-REPORTS/012b-manual-payment-service.md
- ai_context/11-QWEN-REPORTS/013a-compliance-models.md
- ai_context/11-QWEN-REPORTS/013b-delivery-verification-service.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md

Task:
Create ai_context/11-QWEN-REPORTS/BLOCK-4-status-payments-compliance.md.

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
- ai_context/11-QWEN-REPORTS/BLOCK-4-status-payments-compliance.md
```

## Prompt For BE-014A

Use only after Block 4 has been reviewed and approved.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-014A.
Do not start BE-014B or any other task in this chat.

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
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py

Task:
Add admin order list and detail endpoints only.

Scope:
Only modify:
- backend/config/urls.py if needed
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/014a-admin-order-read-endpoints.md

Implementation requirements:
- Add `GET /api/admin/orders/`.
- Add `GET /api/admin/orders/{id}/`.
- Protect both endpoints with DRF `IsAdminUser`.
- Return internal order data useful for operations: id, order_code, status, payment_status, payment_method, customer summary, address summary, totals, scheduled fields, item summaries, created_at.
- Do not add status update, payment update, delivery verification, dashboard, product admin, frontend, or external integrations.

Test requirements:
- Unauthenticated/non-admin access is rejected.
- Admin user can list orders.
- Admin user can retrieve order detail.
- Detail includes items.
- Unknown order returns 404.

Commands to run:
- cd backend
- python -m pytest apps/orders -q

Required report:
- ai_context/11-QWEN-REPORTS/014a-admin-order-read-endpoints.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-014B

Use only after BE-014A completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-014B.
Do not start BE-014C or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/orders/models.py
- backend/apps/orders/services.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py

Task:
Add admin order status update endpoint only.

Scope:
Only modify:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/014b-admin-order-status-update.md

Implementation requirements:
- Add `PATCH /api/admin/orders/{id}/status/`.
- Protect endpoint with DRF `IsAdminUser`.
- Accept `status` and optional `note`.
- Validate status is one of `Order.Status` values.
- Use `transition_order_status()`.
- Store `changed_by` using the authenticated user's username or email.
- Do not add payment update, delivery verification, dashboard, product admin, frontend, or external integrations.

Test requirements:
- Unauthenticated/non-admin access is rejected.
- Admin can update status.
- Status update creates OrderStatusHistory.
- Invalid status returns 400.
- Unknown order returns 404.

Commands to run:
- cd backend
- python -m pytest apps/orders -q

Required report:
- ai_context/11-QWEN-REPORTS/014b-admin-order-status-update.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-014C

Use only after BE-014B completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-014C.
Do not start BE-014D or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/payments/models.py
- backend/apps/payments/services.py

Task:
Add admin payment update endpoint only.

Scope:
Only modify:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/014c-admin-payment-update.md

Implementation requirements:
- Add `PATCH /api/admin/orders/{id}/payment/`.
- Protect endpoint with DRF `IsAdminUser`.
- Accept `method`, `status`, `amount`, optional `reference`, optional `notes`.
- Use `record_manual_payment()`.
- Return updated order payment status and created payment record id.
- Do not expose this through public endpoints.
- Do not add delivery verification, dashboard, product admin, frontend, or external payment gateway integrations.

Test requirements:
- Unauthenticated/non-admin access is rejected.
- Admin can create payment record via endpoint.
- Endpoint updates order.payment_status.
- Reference and notes are stored.
- Invalid payment status/method returns 400.
- Unknown order returns 404.

Commands to run:
- cd backend
- python -m pytest apps/orders apps/payments -q

Required report:
- ai_context/11-QWEN-REPORTS/014c-admin-payment-update.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-014D

Use only after BE-014C completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-014D.
Do not start BE-015A or any other task in this chat.

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
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/compliance/models.py
- backend/apps/compliance/services.py

Task:
Add admin delivery verification endpoint only.

Scope:
Only modify:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/014d-admin-delivery-verification.md

Implementation requirements:
- Add `POST /api/admin/orders/{id}/delivery-verification/`.
- Protect endpoint with DRF `IsAdminUser`.
- Accept `receiver_name`, `receiver_document_checked`, `receiver_is_adult`, optional `verification_notes`.
- Use `record_delivery_verification()`.
- Use authenticated user's username or email as `verified_by`.
- Return order status and delivery verification id.
- Do not store ID images, document images, document numbers, or sensitive ID data.
- Do not add dashboard, product admin, frontend, or external integrations.

Test requirements:
- Unauthenticated/non-admin access is rejected.
- Admin can submit successful delivery verification and order becomes DELIVERED.
- Failed adult/document verification marks order FAILED_AGE_VERIFICATION.
- ComplianceEvent is created for failed verification.
- No sensitive document data is accepted or stored.
- Unknown order returns 404.

Commands to run:
- cd backend
- python -m pytest apps/orders apps/compliance -q

Required report:
- ai_context/11-QWEN-REPORTS/014d-admin-delivery-verification.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For BE-015A

Use only after BE-014D completes successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is for exactly one microtask: BE-015A.
Do not start BE-016 or any other task in this chat.

Read these files from disk before editing:
- ai_context/00-PLAN.md
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/05-BUSINESS-RULES.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/13-ARCHITECTURE.md
- ai_context/14-ENDPOINT-MATRIX.md
- ai_context/15-TEST-PLAN.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py

Task:
Add basic admin dashboard summary endpoint only.

Scope:
Only modify:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/015a-admin-dashboard-summary.md

Implementation requirements:
- Add `GET /api/admin/dashboard/summary/`.
- Protect endpoint with DRF `IsAdminUser`.
- Return total orders.
- Return pending orders.
- Return counts by status.
- Return revenue from orders with payment_status CONFIRMED, using order.total.
- Keep filters out of scope unless already trivial.
- Do not add frontend, charts, analytics packages, product admin, or external integrations.

Test requirements:
- Unauthenticated/non-admin access is rejected.
- Admin can retrieve dashboard summary.
- Total orders count is correct.
- Pending orders count is correct.
- Counts by status are correct.
- Confirmed revenue is correct.

Commands to run:
- cd backend
- python -m pytest apps/orders -q

Required report:
- ai_context/11-QWEN-REPORTS/015a-admin-dashboard-summary.md

Do not commit. Do not push. Do not use git add .
```

## Prompt For Block 5 Summary

Use only after BE-014A, BE-014B, BE-014C, BE-014D, and BE-015A complete successfully.

```text
You are Qwen/local AI working on Drinklivery.

Important execution rule:
This chat/session is only for the Block 5 summary report.
Do not modify backend code.
Do not implement any new task.

Read these files from disk:
- ai_context/03-WORKER-PROTOCOL.md
- ai_context/09-LOCAL-MODEL-TASK-QUEUE.md
- ai_context/10-CODEX-TASKS.md
- ai_context/11-QWEN-REPORTS/014a-admin-order-read-endpoints.md
- ai_context/11-QWEN-REPORTS/014b-admin-order-status-update.md
- ai_context/11-QWEN-REPORTS/014c-admin-payment-update.md
- ai_context/11-QWEN-REPORTS/014d-admin-delivery-verification.md
- ai_context/11-QWEN-REPORTS/015a-admin-dashboard-summary.md
- ai_context/16-BLOCK-EXECUTION-PLAN.md

Task:
Create ai_context/11-QWEN-REPORTS/BLOCK-5-admin-operations.md.

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
- ai_context/11-QWEN-REPORTS/BLOCK-5-admin-operations.md
```
