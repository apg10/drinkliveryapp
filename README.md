# Drinklivery

Drinklivery is a premium cocktail delivery MVP for ready-to-serve cocktail packs, cocktail kits, mocktail packs, and event-oriented bundles.

Initial market: Panama.

Current phase: planning and local AI task preparation.

## Development Workflow

- Architecture and task planning live in `ai_context/`.
- Local AI executes one microtask per chat/session.
- Microtasks are reviewed here by block.
- Backend implementation starts with Block 1: `BE-001` and `BE-002`.
- Do not start frontend work until backend catalog and checkout APIs exist.

## Version Control

- Use Git locally and GitHub as the remote host.
- Commit only after tests pass.
- Use small commits per completed/reviewed block.
- Do not use `git add .`.
- Stage files explicitly.
- Do not push unless explicitly requested.
