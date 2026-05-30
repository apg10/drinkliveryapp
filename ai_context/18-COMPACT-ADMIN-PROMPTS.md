# Compact Admin Prompts

## Purpose

Use these prompts instead of the longer prompts in `ai_context/17-LOCAL-AI-PROMPTS.md` when Qwen/local AI is context-limited.

Rules for compact prompts:

- One endpoint per chat.
- Read only the files listed in the prompt.
- Do not read the full planning folder unless the prompt says so.
- Do not read `ai_context/17-LOCAL-AI-PROMPTS.md` inside Qwen.
- Keep reports short: files changed, tests run, result, blockers.
- If stuck for more than one fix attempt, stop and report the exact failure.

## BE-014B Compact Prompt

```text
Task: BE-014B only. Add admin order status update endpoint.

Read only:
- backend/apps/orders/models.py
- backend/apps/orders/services.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/test_admin_order_endpoints.py

Modify only:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/test_admin_order_endpoints.py
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/014b-admin-order-status-update.md

Implement:
- PATCH /api/admin/orders/{id}/status/
- IsAdminUser only
- body: status, optional note
- validate status against Order.Status.values
- call transition_order_status(order, status, changed_by, note)
- changed_by = username or email, not full name
- response: id, order_code, status

Tests:
- non-admin rejected
- unauthenticated rejected
- admin updates status
- history row created
- invalid status returns 400
- unknown order returns 404

Run:
- python -m pytest apps/orders -q

Do not commit. Do not push. Do not use git add .
Stop if you need files outside the allowed list.
```

## BE-014C Compact Prompt

```text
Task: BE-014C only. Add admin payment update endpoint.

Read only:
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/payments/models.py
- backend/apps/payments/services.py
- backend/apps/orders/tests/test_admin_order_endpoints.py

Modify only:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/test_admin_order_endpoints.py
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/014c-admin-payment-update.md

Implement:
- PATCH /api/admin/orders/{id}/payment/
- IsAdminUser only
- body: method, status, amount, optional reference, optional notes
- validate method against Order.PaymentMethod.values
- validate status against Order.PaymentStatus.values
- call record_manual_payment(...)
- response: order id, order_code, payment_status, payment_record_id

Tests:
- non-admin rejected
- admin creates payment record
- order.payment_status updates
- reference and notes are stored
- invalid method/status returns 400
- unknown order returns 404

Run:
- python -m pytest apps/orders apps/payments -q

Do not commit. Do not push. Do not use git add .
Stop if you need files outside the allowed list.
```

## BE-014D Compact Prompt

```text
Task: BE-014D only. Add admin delivery verification endpoint.

Read only:
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/compliance/models.py
- backend/apps/compliance/services.py
- backend/apps/orders/tests/test_admin_order_endpoints.py

Modify only:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/test_admin_order_endpoints.py
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/014d-admin-delivery-verification.md

Implement:
- POST /api/admin/orders/{id}/delivery-verification/
- IsAdminUser only
- body: receiver_name, receiver_document_checked, receiver_is_adult, optional verification_notes
- reject any document number/image fields with 400
- call record_delivery_verification(...)
- verified_by = username or email
- response: order id, order_code, status, delivery_verification_id

Tests:
- non-admin rejected
- successful verification marks DELIVERED
- failed verification marks FAILED_AGE_VERIFICATION
- failed verification creates ComplianceEvent
- document_number/document_image fields return 400
- unknown order returns 404

Run:
- python -m pytest apps/orders apps/compliance -q

Do not commit. Do not push. Do not use git add .
Stop if you need files outside the allowed list.
```

## BE-015A Compact Prompt

```text
Task: BE-015A only. Add admin dashboard summary endpoint.

Read only:
- backend/apps/orders/models.py
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/test_admin_order_endpoints.py

Modify only:
- backend/apps/orders/urls.py
- backend/apps/orders/views.py
- backend/apps/orders/tests/test_admin_order_endpoints.py
- ai_context/02-LOG.md
- ai_context/11-QWEN-REPORTS/015a-admin-dashboard-summary.md

Implement:
- GET /api/admin/dashboard/summary/
- IsAdminUser only
- response: total_orders, pending_orders, orders_by_status, confirmed_revenue
- confirmed_revenue sums Order.total where payment_status == CONFIRMED

Tests:
- non-admin rejected
- admin can retrieve summary
- total_orders correct
- pending_orders correct
- orders_by_status correct
- confirmed_revenue correct

Run:
- python -m pytest apps/orders -q

Do not commit. Do not push. Do not use git add .
Stop if you need files outside the allowed list.
```
