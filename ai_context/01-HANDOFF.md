# Drinklivery Handoff

## Status

Planning documents have been prepared for local AI execution.

Backend implementation has not started.

Frontend implementation has not started.

## What Local AI Must Read Before Coding

Required context:

- `ai_context/00-PLAN.md`
- `ai_context/03-WORKER-PROTOCOL.md`
- `ai_context/04-APP-BRIEF.md`
- `ai_context/05-BUSINESS-RULES.md`
- `ai_context/06-COMPLIANCE-RULES.md`
- `ai_context/08-MVP-SCOPE.md`
- `ai_context/09-LOCAL-MODEL-TASK-QUEUE.md`
- `ai_context/13-ARCHITECTURE.md`
- `ai_context/14-ENDPOINT-MATRIX.md`
- `ai_context/15-TEST-PLAN.md`

## First Implementation Block

Start with `BLOCK-1: Backend Foundation` only.

Block 1 includes:

- `BE-001`
- `BE-002`

Each microtask must be executed in a separate local AI chat/session.

Recommended Block 1 flow:

1. Local AI chat for `BE-001` only.
2. Local AI chat for `BE-002` only, if `BE-001` succeeds.
3. Local AI chat for Block 1 summary report only.
4. Codex/OpenCode reviews Block 1.

Do not start Block 2 until Block 1 passes tests and is reviewed by Codex/OpenCode.

## Current Rules

- One task equals one intention.
- One block equals one review boundary.
- Do not modify files outside the task's allowed scope.
- Do not create frontend code during backend milestones.
- Do not add dependencies unless the task explicitly allows them.
- Do not implement Docker, Celery, Redis, Stripe, WhatsApp API, or native app code.
- Do not push to a remote.
- Do not commit unless explicitly instructed.
- Do not use `git add .`.
- Use GitHub only after the remote repository is explicitly configured.
