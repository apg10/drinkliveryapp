# BE-009A: Require terms acceptance at checkout

## Task ID

BE-009A

## Summary

Made `terms_accepted` a mandatory field for all checkout order creation. Previously the field defaulted to `False`, allowing orders without any terms acceptance. Now checkout requests without `terms_accepted: true` are rejected with a 400 error.

## Files Changed

- `backend/apps/orders/serializers.py`
  - Changed `terms_accepted` from `default=False` to `required=True`.
  - Added explicit validation guard ensuring `data['terms_accepted']` is `True` before proceeding with checkout.
- `backend/apps/orders/tests/test_checkout_api.py`
  - Added `terms_accepted: True` to the default `payload()` method.
  - Added `test_terms_accepted_is_required_for_all_orders` — verifies checkout is rejected (400) when `terms_accepted` is `False`.
  - Added `test_terms_accepted_true_allows_checkout` — verifies checkout succeeds (201) and the order stores `terms_accepted=True`.

## Tests Added or Updated

Tests added:
- `test_terms_accepted_is_required_for_all_orders` (400 rejection)
- `test_terms_accepted_true_allows_checkout` (201 success)

Tests updated:
- `payload()` — now includes `terms_accepted: True` in the base payload so all existing tests continue to pass.

## Test Command Run

```
cd backend
python -m pytest -v
```

## Test Result

88 tests passed, 0 failed.

Relevant tests:
- `test_terms_accepted_is_required_for_all_orders` — PASSED
- `test_terms_accepted_true_allows_checkout` — PASSED

All pre-existing tests continue to pass.

## Notes or Risks

- The `terms_accepted` field already exists on the Order model with `default=False`. The enforcement is now entirely at the serializer level.
- No sensitive ID document storage or compliance data was added per the FORBIDDEN constraint.
- BE-009B (age confirmation for alcoholic products) remains pending for the next chat session.

## Ready for Review

Yes, this task is ready for Codex/OpenCode review.
