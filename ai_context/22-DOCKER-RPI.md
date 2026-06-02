# Docker RPi Demo Stack

## Purpose

Provide a Docker-based local demo stack that serves the frontend and backend through one browser origin, allowing the frontend to call `/api` without CORS during demo. This resolves the FE-QA-001 public browser blocker for local demonstration.

## Files Created

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Multi-arch Python 3.12 image; installs requirements; runs migrations, seed, and `runserver` |
| `frontend/Dockerfile` | Multi-stage: Node builds frontend, nginx serves static + reverse proxy |
| `frontend/nginx.conf` | Reverse proxies `/api/`, `/admin/`, and `/static/` to the backend service |
| `docker-compose.rpi.yml` | Defines `backend` and `frontend` services with `db_data` volume |
| `.dockerignore`, `backend/.dockerignore`, `frontend/.dockerignore` | Exclude node_modules, .venv, env files, SQLite files, and other local artifacts from Docker build contexts |
| `.env.docker.example` | Example env vars for demo (DJANGO_SECRET_KEY, ALLOWED_HOSTS, FRONTEND_PORT) |

## Raspberry Pi Prerequisites

1. **Raspberry Pi OS** (any recent ARM64/arm64lite image)
2. **Docker Engine** installed on the Pi:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```
3. **Docker Buildx** (optional, for multi-arch build on a laptop):
   ```bash
   docker buildx create --name rpi --driver docker-container
   docker buildx use rpi
   ```
4. Clone the repo to the Pi, or copy the project folder over.

## Build and Run Commands

### On Raspberry Pi (native ARM build)

```bash
# 1. Copy env file
cp .env.docker.example .env.docker

# 2. Edit .env.docker, set ALLOWED_HOSTS to your Pi hostname or LAN IP
nano .env.docker

# 3. Build and start
docker compose --env-file .env.docker -f docker-compose.rpi.yml build
docker compose --env-file .env.docker -f docker-compose.rpi.yml up -d
```

### Cross-build note

Native build on the Raspberry Pi is the recommended path for this demo stack. Cross-building a compose stack from x86_64 requires building and publishing/loading both service images separately, then changing compose to reference those image tags instead of local `build:` contexts. That workflow is intentionally not documented as a one-command path here to avoid giving an invalid buildx command.

## How to Access

| Service | URL | Description |
|---------|-----|-------------|
| Frontend (nginx) | `http://<host-ip>:8080/` | SPA served by nginx, same-origin API |
| Backend API | `http://<host-ip>:8080/api/` | Proxied to backend:8000 through nginx |
| Admin | `http://<host-ip>:8080/admin/` | Proxied to Django admin at backend:8000 |
| Health check | `http://<host-ip>:8080/api/health/` | `{"status": "ok", "service": "drinklivery-backend"}` |

## Create a Local Demo Superuser Inside the Backend Container

```bash
docker compose --env-file .env.docker -f docker-compose.rpi.yml exec backend python manage.py createsuperuser
```
Follow the prompts. Credentials should be chosen uniquely for demo use.

## How to Reset the SQLite Volume

```bash
# Stop the stack
docker compose --env-file .env.docker -f docker-compose.rpi.yml down

# Remove the named volume (deletes all seeded data)
docker volume rm drinkliveryapp_db_data

# Rebuild and rerun (migrations + seed will recreate data)
docker compose --env-file .env.docker -f docker-compose.rpi.yml up -d --build
```

## Known Limitations

- **Demo only, not production:** Uses `runserver` (not gunicorn or uwsgi), debug mode, and a weak default SECRET_KEY.
- **Admin login UI still out of scope:** The frontend has no admin login screen. Admin access relies on a browser having an active Django session at `http://<host-ip>:8080/admin/`.
- **Admin mutation CSRF behavior:** The frontend fetch calls do not include CSRF tokens, so admin PATCH/POST may fail in a real browser without a logged-in session at the same origin. This requires follow-up browser testing when an admin login strategy is decided.
- **HTTPS not configured:** Nginx serves HTTP only. TLS termination is out of scope for this demo.
- **Postgres not configured:** SQLite is used exclusively. Production should switch to PostgreSQL with a `DATABASE_URL` approach.
- **No health check probes:** Docker compose does not include healthcheck or restart policies.
- **No CORS for local Vite dev:** This stack solves the demo CORS problem. Local development with Vite still requires either CORS headers in settings or a separate proxy setup.

## Verification Status

Verified on this machine:

- `cd frontend && VITE_API_BASE_URL=/api npm run build` passed.
- `cd backend && .venv/bin/python -m pytest` passed with 203 tests.

Not verified on this machine:

- `docker compose --env-file .env.docker -f docker-compose.rpi.yml build`
- `docker compose --env-file .env.docker -f docker-compose.rpi.yml up -d`
- Runtime browser QA through `http://127.0.0.1:8080/`

Reason: Docker is not installed in the current environment. Runtime verification must be done on the Raspberry Pi or another Docker-capable machine.
