# Compliance Rules

## Alcohol Compliance Requirements

1. Customer must confirm legal drinking age before placing an alcoholic order.
2. Alcoholic orders require in-person handoff.
3. Receiver document must be checked at delivery.
4. If receiver is underage, unavailable, or visibly intoxicated, the order must not be delivered.
5. The system must allow marking an order as `FAILED_AGE_VERIFICATION`.
6. The app must display responsible drinking messaging.
7. The app must support configurable operating hours.
8. The app should later support restricted dates or unavailable dates.
9. MVP must not store sensitive document images.
10. Legal implementation details must be verified locally by the Panama operating partner before real sales.

## Delivery Verification Data

For MVP, store only:

- Receiver name
- Whether document was checked
- Whether adult verification passed
- Timestamp
- Operator/driver/admin who verified, if available
- Notes if needed

Do not store:

- ID images
- Passport images
- National ID scans
- Driver license images
- Sensitive document numbers unless explicitly approved later

## Required Delivery Failure Logic

Delivery must fail if:

- Receiver is under legal drinking age.
- Receiver refuses document check.
- Receiver is unavailable.
- Receiver appears visibly intoxicated.
- Delivery would be left unattended.
- Delivery would be handed to a minor.

## Compliance Review Rule

Any code touching age confirmation, delivery verification, order delivery status, or compliance event logging requires tests and Codex/OpenCode review before the next milestone.
