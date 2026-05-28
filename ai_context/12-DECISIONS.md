# Architecture Decisions

## ADR-001 Backend Framework

Decision: Use Django and Django REST Framework.

Reason: Drinklivery needs models, admin, users, operational workflows, orders, compliance logs, and APIs. Django provides the fastest reliable path for this kind of business application.

## ADR-002 Backend Architecture

Decision: Use a modular Django monolith.

Reason: The MVP should be simple and reviewable. Microservices would add unnecessary operational complexity.

## ADR-003 Database

Decision: Use SQLite for initial local development and PostgreSQL later.

Reason: SQLite keeps local setup simple. PostgreSQL is appropriate for staging/production later.

## ADR-004 Settings

Decision: Use one `config/settings.py` initially.

Reason: Split settings are unnecessary before deployment complexity exists.

## ADR-005 Tenant Strategy

Decision: Start with one tenant, Drinklivery Panama, but model tenant ownership from the beginning.

Reason: This keeps the MVP simple while preserving future multi-market reuse.

## ADR-006 Payments

Decision: Use manual payment tracking initially.

Reason: Payment gateways are not needed for first backend milestones and would slow MVP validation.

## ADR-007 WhatsApp

Decision: Do not integrate WhatsApp API initially.

Reason: Manual links/logging are enough at first.

## ADR-008 Compliance Data

Decision: Do not store sensitive ID document images in MVP.

Reason: This reduces compliance and privacy risk. Store only delivery verification metadata.

## ADR-009 Frontend Timing

Decision: Do not build frontend until backend catalog and checkout are available.

Reason: Frontend implementation should be based on real API contracts.

## ADR-010 Version Control

Decision: Use Git locally and GitHub as the remote repository host.

Reason: Local AI will produce multiple controlled microtasks. Git/GitHub provides reviewable history, safer checkpoints, and a clean path to collaborate or deploy later.
