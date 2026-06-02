# FE-004B3 — Selected Zone Totals

## Summary

Computed checkout delivery fee from the user-selected delivery zone's `base_fee`, displayed that fee with the zone name in the summary, and updated the checkout total to `cartSubtotal + checkoutDeliveryFee`. The `deliveryFee` prop is used only as a fallback when no zone is selected. Submit order button remains disabled.

## Files changed

- `frontend/src/components/CheckoutView.jsx` — core changes in totals and summary.
- `ai_context/11-QWEN-REPORTS/fe-004b3-selected-zone-totals.md` — this report.

## Total calculation behavior

| Scenario | Delivery fee source |
|---|---|
| Zone is selected (has `selectedZoneId` that matches a loaded zone) | `selectedZone.base_fee` |
| No zone selected or zone not found in `zones` list | `deliveryFee` prop (existing fallback) |
| `deliveryFee` prop is `null`/`undefined` and no zone | `0` |

Checkout total = `cartSubtotal + checkoutDeliveryFee` (rounded to 2 decimals).

The delivery fee line in the summary shows `(Zone Name)` after "Delivery fee" when a zone is selected. Review cleanup converts API decimal strings with `Number(...)` before formatting/calculation, so `base_fee` and `minimum_order_amount` values returned as strings by Django/DRF do not break checkout rendering. No order creation calls or checkout POST requests were added.

## Build result

```
> drinklivery-frontend@0.1.0 build
> vite build

✓ 29 modules transformed.
✓ built in 528ms
```

Build succeeded with no errors.

## Confirm no checkout POST/fetch beyond delivery zones

Confirmed: no new fetch/XHR/POST was added. The `getPublicDeliveryZones` call that loads zones was already present before this task. No order creation API calls are present in this file or the diff.

## Whether task is ready for review

Yes. This task is ready for Codex/OpenCode review.
