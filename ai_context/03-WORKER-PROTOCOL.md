# Local AI Worker Protocol

## Purpose

This protocol controls how Qwen/local AI workers contribute to Drinklivery.

Local AI should do most implementation work, but only through narrow, reviewable tasks created by Codex/OpenCode.

## Roles

Codex/OpenCode:

- Defines architecture.
- Creates tasks.
- Reviews worker output.
- Enforces tests and scope.
- Updates planning documents.

Qwen/local AI:

- Executes one assigned block at a time.
- Executes exactly one microtask per chat/session.
- Follows the allowed file list exactly.
- Adds or updates tests for backend behavior.
- Runs required commands.
- Writes a completion report per microtask.
- Writes a block summary report only when explicitly assigned the final block-summary chat.
- Stops when blocked or unclear.

## Mandatory Rules For Qwen

1. Execute only the assigned microtask in the current chat/session.
2. Do not continue into the next microtask in the same chat/session.
3. Read all context files listed in the assigned task.
4. Modify only files listed in `ALLOWED FILES TO MODIFY`.
5. Do not modify files listed in `FORBIDDEN FILES`.
6. Do not make architecture decisions.
7. Do not add dependencies unless explicitly allowed.
8. Do not refactor unrelated code.
9. Do not create frontend code during backend tasks.
10. Do not add payment gateways.
11. Do not add WhatsApp API integration.
12. Do not add Docker, Celery, Redis, or Kubernetes.
13. Do not store sensitive ID document images.
14. Add or update tests for every backend behavior.
15. Run the task's required test command before reporting completion.
16. Run the task's required test command before writing the microtask report.
17. Do not push.
18. Do not commit unless explicitly instructed.
19. Do not use `git add .`.
20. Do not create branches or change Git remotes unless explicitly assigned.

## Stop Conditions

Stop and report instead of guessing if:

- A required architecture decision is missing.
- The task requires editing forbidden files.
- The task requires a new dependency not explicitly allowed.
- Tests fail and cannot be fixed within scope.
- Business or compliance rules conflict.
- The requested behavior would store sensitive ID images.
- The task would require frontend work during a backend milestone.

## Required Report Format

Create a Markdown report after each microtask at:

`ai_context/11-QWEN-REPORTS/{task-id}-{short-name}.md`

Report must include:

1. Task ID
2. Summary
3. Files changed
4. Tests added or updated
5. Test command run
6. Test result
7. Notes or risks
8. Whether task is ready for Codex/OpenCode review

## Review Gate

No next block starts until Codex/OpenCode reviews the previous block output.

Within an assigned block, Adrian starts a new local AI chat for each microtask. The next microtask in the same block can be assigned after the previous microtask finishes and writes its report, unless a stop condition is triggered.

See `ai_context/16-BLOCK-EXECUTION-PLAN.md` for block boundaries and block report requirements.

## Chat Isolation Rule

Each local AI chat has limited context. Every microtask prompt must tell Qwen/local AI to read the required context files from disk.

Do not rely on memory from a previous local AI chat.

Do not ask Qwen/local AI to execute multiple microtasks in one chat.

## Git Rules

Qwen/local AI must not commit, push, create branches, change remotes, or stage files unless the assigned task explicitly allows it.

Read-only Git commands are acceptable when useful for reporting, such as `git status --short` or `git diff --stat`.
