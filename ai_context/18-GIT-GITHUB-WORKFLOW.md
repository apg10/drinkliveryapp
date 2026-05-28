# Git And GitHub Workflow

## Purpose

Drinklivery will use Git for local version control and GitHub as the remote repository host.

The project is being built with local AI support, so version control must make it easy to review, isolate, and revert small units of work if needed.

## Current Policy

1. Use Git locally from the start.
2. Use GitHub as the remote once the repository is created.
3. Do not commit during an unfinished microtask.
4. Prefer one commit per reviewed block, not one commit per tiny edit.
5. Commit only after the block tests pass and Codex/OpenCode review is complete.
6. Do not push unless Adrian explicitly approves.
7. Do not use `git add .`.
8. Stage files explicitly.
9. Never commit `.env`, local databases, virtual environments, caches, or secrets.
10. Keep commit messages short and descriptive.

## Branch Strategy

Initial MVP branch strategy:

- `main`: stable reviewed work only.
- `block/{block-number}-{short-name}`: optional working branch per block if needed.

Recommended block branches:

- `block/1-backend-foundation`
- `block/2-catalog-delivery`
- `block/3-checkout-foundation`
- `block/4-status-payments-compliance`
- `block/5-admin-operations`
- `block/6-seed-deploy-prep`

For now, simple direct work on `main` is acceptable if commits happen only after block review. Use block branches if experimentation increases.

## Commit Timing

Do not commit after every microtask by default.

Recommended flow:

1. Local AI completes every microtask in the block, one chat per microtask.
2. Local AI creates all per-task reports.
3. Local AI creates the block summary report.
4. Codex/OpenCode reviews the block diff and test results.
5. Fix issues if needed.
6. Run final tests.
7. Commit the reviewed block.

## Initial Commit Recommendation

After planning is accepted, create an initial planning commit with:

```bash
git add .gitignore README.md ai_context drinklivery_codex_architecture_brief.txt drinklivery_codex_qwen_microtask_master_brief.txt
git commit -m "Add Drinklivery planning context"
```

Do not run this until Adrian approves the commit.

## Block 1 Commit Recommendation

After Block 1 is implemented, tested, and reviewed:

```bash
git add backend/manage.py backend/requirements.txt backend/.env.example backend/pytest.ini backend/config backend/apps ai_context/02-LOG.md ai_context/11-QWEN-REPORTS
git commit -m "Initialize backend foundation"
```

Adjust the explicit file list based on the actual diff.

## GitHub Remote Setup

Once the GitHub repository exists, connect it with:

```bash
git remote add origin <github-repo-url>
git branch -M main
```

Push only after approval:

```bash
git push -u origin main
```

## GitHub Repository Recommendation

Recommended repository name:

`drinkliveryapp`

Recommended visibility during MVP planning:

Private.

## Local AI Git Rules

Qwen/local AI must not:

- Commit
- Push
- Create branches
- Change remotes
- Use `git add .`
- Modify `.gitignore` unless explicitly assigned

Qwen/local AI may run read-only Git commands only if explicitly useful, such as:

- `git status --short`
- `git diff --stat`
