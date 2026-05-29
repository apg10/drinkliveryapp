# BE-010: Order Status Transition History

## 1. Task ID

BE-010

## 2. Summary

Added a centralized `transition_order_status` helper function in `backend/apps/orders/services.py` that creates `OrderStatusHistory` records whenever an order's status changes. If the new status equals the current status, no history record is created and the order is returned unchanged.

## 3. Files Changed

- `backend/apps/orders/services.py` - Added `transition_order_status` function and imported `OrderStatusHistory`
- `backend/apps/orders/tests/test_models.py` - Added `OrderStatusTransitionTest` class with 4 test cases
- `ai_context/02-LOG.md` - Logged task completion
- `ai_context/11-QWEN-REPORTS/010-order-status-history.md` - This report

## 4. Tests Added

**File:** `backend/apps/orders/tests/test_models.py`

**Test class:** `OrderStatusTransitionTest` (inherits `OrderModelTestCase`)

1. `test_transition_changes_order_status` - Verifies that calling `transition_order_status` with a different status updates the order's status field.
2. `test_transition_creates_history` - Verifies that a status change creates one `OrderStatusHistory` row with correct `previous_status` and `new_status`.
3. `test_transition_no_history_when_status_same` - Verifies that calling `transition_order_status` with the same status does NOT create any history record.
4. `test_transition_stores_note_and_changed_by` - Verifies that optional `note` and `changed_by` parameters are stored in the history record.

## 5. Test Command Run

```
cd backend
python -m pytest apps/orders -q
```

## 6. Test Result

34 passed in 0.68s

All tests passing. 4 new transition tests added, 30 existing tests (17 checkout + 13 models) unchanged.

## 7. Notes / Risks

- No state machine enforcement yet. This helper allows any status-to-status transition. Future admin endpoints (BE-014) can enforce allowed transitions at the view/serializer layer.
- The caller must pass an unsaved or fresh model instance for the initial `order.status` check before saving. Callers should fetch the latest order before calling `transition_order_status` if concurrent modifications are possible.
- No notifications, payments, or compliance side effects are triggered by this helper. Those can be added as the workflow matures.

## 8. Ready for Review

Yes
