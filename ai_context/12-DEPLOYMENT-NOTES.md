# Deployment Notes — Simple Backend Demo/Staging

## Scope

This document covers a minimal deployment of the Drinklivery backend for demo and staging purposes. It is intentionally simple. Docker, Kubernetes, CI/CD, and Celery/Redis are out of MVP scope for now.

## Prerequisites

- Python 3.12+
- pip or uv

## Environment Variables

Copy `.env.example` to `.env` and set the following:

| Variable | Demo Value | Staging Value |
|---|---|---|
| `DJANGO_DEBUG` | `True` | `False` |
| `DJANGO_SECRET_KEY` | any long random string | a proper secret manager or vault value |
| `DATABASE_URL` | Not currently used by settings | Future PostgreSQL connection string once database config supports it |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | your staging domain, e.g. `staging.drinklivery.com` |
| `CORS_ALLOWED_ORIGINS` | Not currently read from env | Future comma-separated allowed origins once settings supports it |

### Required production variables

Before deploying to staging, ensure the following are set:

1. `DJANGO_DEBUG=False`
2. `DJANGO_SECRET_KEY` is a unique, random, long string (never use the default or the example value)
3. `ALLOWED_HOSTS` contains only the domains you will serve
4. `CORS_ALLOWED_ORIGINS` is configured in settings with only the origins that need access
5. No ID document images or sensitive customer data are stored or exposed

## Database

Current configuration uses **SQLite** (`db.sqlite3`) for simplicity. `backend/config/settings.py` currently hardcodes SQLite and does not parse `DATABASE_URL` yet.

To migrate to PostgreSQL later:

1. Add settings support for PostgreSQL or `DATABASE_URL` parsing.
2. Set `DATABASE_URL=postgresql://user:pass@host:5432/drinklivery` or equivalent provider settings.
3. Install `psycopg2-binary` or `psycopg`.
4. Create the database on your PostgreSQL server.
5. Run migrations as normal.

> SQLite is sufficient for demo and low-traffic staging. Switch to PostgreSQL before any meaningful production load.

## Setup

```powershell
# Create virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend\requirements.txt

# Copy environment file
copy backend\.env.example backend\.env
# Edit backend\.env with your values

# Apply migrations
python backend\manage.py migrate

# If deploying for demo with static files collected:
python backend\manage.py collectstatic --noinput

# Run management commands (optional seeding)
python backend\manage.py seed_drinklivery_panama

# Start the server
python backend\manage.py runserver 0.0.0.0:8000
```

## Local Run

```powershell
python backend\manage.py runserver
```

Visit http://127.0.0.1:8000/api/health/ to verify the backend is working.

## collectstatic Note

`collectstatic` is only relevant when serving static files from Django (e.g., admin panel in production). For a demo running `runserver`, it is not required. Include it only if you plan to serve Django admin or other static assets without a reverse proxy.

## Security Checklist

Before any deployment (demo or staging), verify:

- [ ] `DJANGO_DEBUG=False`
- [ ] `DJANGO_SECRET_KEY` is a unique, random, long string
- [ ] `ALLOWED_HOSTS` contains only your deployment domains
- [ ] `CORS_ALLOWED_ORIGINS` contains only required origins
- [ ] No ID document images are stored or exposed via any endpoint
- [ ] No document numbers or sensitive PII are returned in public responses
- [ ] Admin endpoints use `IsAdminUser` permission class (already implemented)
- [ ] Database is backed up regularly (especially with SQLite)

## Out of Scope

The following are **not** covered in this document and are out of MVP scope:

- Docker or containerization
- Kubernetes
- CI/CD pipelines
- Celery task queues
- Redis cache/broker
- Nginx or reverse proxy configuration
- Cloud provider-specific deployment guides (Heroku, AWS, etc.)

These can be added in a later phase when the MVP is validated.
