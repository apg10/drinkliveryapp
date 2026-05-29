# BE-009B: Alcohol Age Confirmation Rules

## Task ID

BE-009B

## Summary

Added checkout validation requiring `age_confirmed_by_customer=true` when the cart contains at least one alcoholic product.

Mocktail-only carts do not require age confirmation. Mixed carts containing alcoholic and non-alcoholic products require age confirmation.

## Files Changed

- `backend/apps/orders/serializers.py`
- `backend/apps/orders/tests/test_checkout_api.py`
- `ai_context/02-LOG.md`
- `ai_context/11-QWEN-REPORTS/009-age-confirmation-rules.md`

## Tests Added Or Updated

Added checkout API tests covering:

- Alcoholic order without age confirmation is rejected.
- Alcoholic order with age confirmation succeeds.
- Mocktail-only order does not require age confirmation.
- Mixed alcoholic/mocktail cart without age confirmation is rejected.
- Mixed alcoholic/mocktail cart with age confirmation succeeds.

Existing checkout tests continue to verify terms acceptance, cart validation, tenant isolation, delivery zone validation, product validation, and totals.

## Test Command Run

```text
python -m pytest apps/orders -q
python -m pytest
python manage.py check
python manage.py makemigrations --check --dry-run
```

## Test Result

```text
python -m pytest apps/orders -q -> 30 passed
python -m pytest -> 93 passed
python manage.py check -> System check identified no issues
python manage.py makemigrations --check --dry-run -> No changes detected
```

## Notes Or Risks

- No ID image, document image, document number, or sensitive ID data storage was added.
- Age confirmation is enforced at checkout serializer validation level.
- Delivery handoff verification remains out of scope for BE-009B and belongs to the later compliance block.

## Ready For Codex/OpenCode Review

Yes.
