# IMG-001: Product Image Seed URLs

## Summary

Added stable `/catalog/*.webp` product image URLs to the Drinklivery Panama seed command and updated tests to assert them. The seed command sets `image` on create and updates it idempotently on re-run.

## Files changed

- `backend/apps/core/management/commands/seed_drinklivery_panama.py`
  - Added `'image'` key to each entry in `products_data`.
  - Included `'image': prod_data.get('image', '')` in `defaults` during `get_or_create`.
  - Added `prod.image = prod_data.get('image', '')` and `'image'` to `update_fields` in the existing-product branch.

- `backend/apps/core/tests/test_seed_drinklivery_panama.py`
  - Updated `test_command_creates_products` to assert each product's image URL.
  - Updated `test_running_again_updates_existing_product` to assert `mojito.image` after re-seeding.

## Test command run

```
cd backend && source .venv/bin/activate && pytest apps/core/tests/test_seed_drinklivery_panama.py -v
```

## Test result

18 passed in 0.46s

- All existing tests continue to pass.
- `test_command_creates_products` now asserts:
  - `mojito.image == '/catalog/mojito-pack-x4.webp'`
  - `margarita.image == '/catalog/margarita-pack-x4.webp'`
  - `mocktail.image == '/catalog/passion-fruit-mocktail-pack-x4.webp'`
- `test_running_again_updates_existing_product` now asserts image is idempotent.

## Scope confirmation

- No frontend files were modified.
- No migrations were added or modified.
- No new dependencies were added.
- No media upload handling was added.
- No compliance-sensitive fields (e.g., age verification, ID documents) were changed.
- No product slugs, names, prices, servings, variants, categories, or other business data were altered beyond the `image` field.

## Ready for review

Yes. The change is minimal and fully covered by tests.
