# Drinklivery Development Plan

## Current Phase

Planning phase.

No backend, frontend, database models, integrations, or infrastructure should be implemented until the planning documents are accepted.

## Project Summary

Drinklivery is a premium cocktail delivery platform for ready-to-serve cocktail packs, cocktail kits, mocktail packs, and event-oriented bundles.

The initial pilot market is Panama.

Drinklivery is not a standalone liquor bottle delivery app. The MVP must position the product as premium cocktail experiences delivered for homes, Airbnbs, birthdays, after-office gatherings, private meetings, and small events.

## Ownership Principle

The software platform belongs to Adrian / Lazy Software.

The Panama local operator is responsible for permits, preparation, sourcing, recipes, sanitary handling, delivery coordination, customer operations, and alcohol-related compliance.

The Panama pilot is the first operating case, not the owner of the full software platform.

## Development Strategy

1. Plan architecture first.
2. Use local AI workers for narrow implementation tasks.
3. Review every local AI block before continuing.
4. Keep backend milestones small and testable.
5. Build backend first.
6. Build frontend only after catalog and checkout APIs exist.
7. Use Git locally and GitHub as the remote repository host.

## Technical Direction

Backend:

- Python
- Django
- Django REST Framework
- pytest
- pytest-django
- SQLite for local development
- PostgreSQL later
- django-cors-headers
- python-dotenv

Frontend later:

- React
- Vite
- Mobile-first storefront
- Admin panel after backend workflows stabilize

Do not add yet:

- Docker
- Celery
- Redis
- Stripe
- WhatsApp API
- Native mobile app
- Kubernetes
- Marketplace logic
- Advanced inventory
- Loyalty system
- AI recommendations

## Execution Model

Codex/OpenCode role:

- Architect
- Planner
- Reviewer
- Test enforcement agent
- Documentation maintainer

Qwen/local AI role:

- Execute assigned blocks of narrow microtasks
- Complete exactly one microtask per local AI chat/session
- Edit only allowed files
- Add tests for backend behavior
- Run required tests
- Write completion reports
- Stop when scope is ambiguous

## Block-Based Workflow

Development will proceed by blocks to avoid constant review after every individual microtask.

Each block contains a small group of related microtasks. Qwen/local AI must still write a report per microtask, then write one block summary report. Codex/OpenCode reviews the whole block before the next block starts.

See `ai_context/16-BLOCK-EXECUTION-PLAN.md`.

## Phase Gates

Planning phase is complete when:

- Architecture document exists.
- Endpoint matrix exists.
- Test plan exists.
- Local AI task queue exists.
- Codex review checklist exists.
- BE-001 is executable without architecture questions.

Backend implementation starts only with:

- Block 1: `BE-001` and `BE-002`.

## Immediate Next Step

After this planning set is reviewed, give Qwen/local AI `BLOCK-1` from `ai_context/16-BLOCK-EXECUTION-PLAN.md`.

Before implementation starts, confirm whether to create the initial planning commit and GitHub remote.
