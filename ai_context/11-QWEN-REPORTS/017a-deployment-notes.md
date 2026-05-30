# BE-017A — Deployment Notes Report

## Task

Add deployment preparation notes for a simple backend demo/staging deployment of the Drinklivery Django monolith.

## Files Modified

- `ai_context/12-DEPLOYMENT-NOTES.md` — created (deployment notes document)
- `ai_context/02-LOG.md` — appended (log entry for BE-017A)
- `ai_context/11-QWEN-REPORTS/017a-deployment-notes.md` — created (this report)

## Scope

- Only documentation was modified. No backend code was changed.
- No Docker, Kubernetes, CI/CD, Celery, or Redis was added.
- No provider-specific deployment files were created.

## Deployment Notes Summary (`12-DEPLOYMENT-NOTES.md`)

### Environment Variables

Environment variables and deployment settings documented:

| Variable | Purpose | Demo Default | Staging Requirement |
|---|---|---|---|
| `DJANGO_DEBUG` | Django debug mode | `True` | Must be `False` |
| `DJANGO_SECRET_KEY` | Django secret key | `change-me-in-production` | Must be unique random string |
| `DATABASE_URL` | Future database connection string | Not currently used by settings | PostgreSQL later after settings support |
| `ALLOWED_HOSTS` | Host header whitelist | `localhost,127.0.0.1` | Deployment domain(s) only |
| `CORS_ALLOWED_ORIGINS` | Future CORS origin env setting | Not currently read from env | Required origins only after settings support |

### Setup and Run Commands

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
copy backend\.env.example backend\.env
# Edit backend\.env
python backend\manage.py migrate
python backend\manage.py collectstatic --noinput   # only if serving static files
python backend\manage.py seed_drinklivery_panama    # optional
python backend\manage.py runserver 0.0.0.0:8000
```

Local run: `python backend\manage.py runserver`

### collectstatic

Included only as relevant for serving Django admin or static assets. Not required for `runserver` demo mode.

### SQLite → PostgreSQL

- Current default: SQLite (`db.sqlite3`) — hardcoded in `settings.py`
- To switch to PostgreSQL later: add settings support for PostgreSQL or `DATABASE_URL`, install `psycopg2-binary` or `psycopg`, run migrations
- Explicitly noted in deployment notes

### Security Checklist

Pre-deployment checklist:

1. `DJANGO_DEBUG=False`
2. `DJANGO_SECRET_KEY` is unique and random
3. `ALLOWED_HOSTS` contains only deployment domains
4. `CORS_ALLOWED_ORIGINS` contains only required origins
5. No ID document images stored or exposed
6. No document numbers or sensitive PII in public responses
7. Admin endpoints use `IsAdminUser` permission
8. Database is backed up regularly

### Out of Scope

Explicitly excluded from MVP:

- Docker / containerization
- Kubernetes
- CI/CD pipelines
- Celery task queues
- Redis cache/broker
- Nginx or reverse proxy configuration
- Cloud provider-specific guides

## Verification

No backend code was modified. No tests were run (documentation-only task).
