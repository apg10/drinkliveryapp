# DOCKER-001 Report: Raspberry Pi Demo Docker Stack

## Summary

Created a Docker-based local demo stack that serves the frontend and backend through one browser origin, resolving the FE-QA-001 public browser CORS blocker for demo purposes. The frontend is built with `VITE_API_BASE_URL=/api`, served by nginx, which reverse-proxies `/api/`, `/admin/`, and `/static/` to the Django backend. All images use official multi-arch base images (`python:3.12-slim`, `node:22-slim`, `nginx:alpine`) with no forced `linux/amd64` — suitable for building and running on Raspberry Pi ARM64.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `backend/Dockerfile` | Created | Multi-arch Python 3.12; installs `requirements.txt`; sets `DB_PATH` for volume mount; runs migrations + seed + `runserver` |
| `backend/config/settings.py` | Modified (1 line) | Added `os.getenv('DB_PATH', ...)` to `DATABASES.NAME` so SQLite can be mounted on a Docker volume |
| `frontend/Dockerfile` | Created | Multi-stage: Node 22 builds with `VITE_API_BASE_URL=/api`; nginx:alpine serves static + reverse proxy |
| `frontend/nginx.conf` | Created | Reverse proxies `/api/`, `/admin/`, and `/static/` to `backend:8000`; SPA fallback for `/` |
| `docker-compose.rpi.yml` | Created | Defines `backend` (port 8000 exposed internally) and `frontend` (port `8080` on host), with `db_data` named volume |
| `.dockerignore`, `backend/.dockerignore`, `frontend/.dockerignore` | Created | Exclude `.venv/`, `node_modules/`, `.env`, `db.sqlite3`, local build artifacts, IDE/OS files |
| `.env.docker.example` | Created | Example `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `ALLOWED_HOSTS`, `FRONTEND_PORT` |
| `.gitignore` | Modified | Allows `.env.docker.example` to be tracked while keeping real `.env.*` files ignored |
| `ai_context/22-DOCKER-RPI.md` | Created | Usage documentation (prerequisites, build/run commands, access URLs, superuser creation, volume reset, known limitations) |
| `ai_context/02-LOG.md` | Updated | Appended DOCKER-001 log entry |

## Architecture

```
                     +------------+
  Host :8080  --->   |  Frontend  |
  (nginx)            |  :80       |
                     |            |
                     |  /api/  --> |  backend:8000 (Django runserver)
                     |  /admin/ --> |  backend:8000 (Django admin)
                     |  /static/ --> |  backend:8000 (Django static)
                     +------------+
                              |
                              v
                     +--------------+
                     |  db_data     |
                     |  (volume)    |
                     |  db.sqlite3  |
                     +--------------+
```

Key design decisions:

- **Same-origin serving:** nginx acts as the single public entry point. Frontend fetches `/api/...` which nginx proxies to `backend:8000/api/...`. No CORS needed for demo.
- **Multi-arch images:** All base images (`python:3.12-slim`, `node:22-slim`, `nginx:alpine`) are official multi-arch images, no platform pinning.
- **SQLite persistence:** `db.sqlite3` stored in a Docker named volume `db_data` mounted at `/app/data/` inside the backend container.
- **Auto-bootstrap:** Container startup runs `migrate`, `seed_drinklivery_panama`, then `runserver`.

## Commands Run and Results

### Frontend Build Verification

```bash
cd frontend && VITE_API_BASE_URL=/api npm run build
```

**Result: PASSED** in original Qwen run, and passed again during cloud review after compose/doc fixes.
```
vite v6.4.2 building for production...
transforming...
33 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.74 kB │ gzip:  0.43 kB
dist/assets/index-DXy6SOXT.css   61.14 kB │ gzip:  7.90 kB
dist/assets/index-C0Kz5BqN.js   262.58 kB │ gzip: 72.95 kB
built in 564ms
```

Cloud review rerun:

```bash
cd frontend && VITE_API_BASE_URL=/api npm run build
```

Result: PASSED — 33 modules transformed, built in 587ms.

### Backend Test Verification

Cloud review ran:

```bash
cd backend && .venv/bin/python -m pytest
```

Result: PASSED — 203 passed in 19.19s. This validates the `DB_PATH` settings change did not break the existing backend test suite.

Verified that `/api` is present in the built JS bundle, confirming nginx will see relative `/api/...` URLs.

### Docker Verification

**Not run.** Docker is not installed on this system. The following commands should be executed when Docker is available:

```bash
# Build the stack
docker compose --env-file .env.docker -f docker-compose.rpi.yml build

# Start the stack
docker compose --env-file .env.docker -f docker-compose.rpi.yml up -d

# Verify health
curl http://127.0.0.1:8080/api/health/
# Expected: {"status": "ok", "service": "drinklivery-backend"}

# Verify frontend loads
curl http://127.0.0.1:8080/
# Expected: HTML with reference to dist/assets/

# Verify API proxied through frontend
curl http://127.0.0.1:8080/api/public/drinklivery-panama/catalog/
# Expected: 200 with seeded catalog data (after seed runs)
```

## Raspberry Pi Compatibility Notes

- **Base images:** `python:3.12-slim`, `node:22-slim`, `nginx:alpine` are all official Go-ecosystem multi-platform images supporting `linux/arm64`.
- **Build on the Pi:** The Pi can build natively with `docker compose -f docker-compose.rpi.yml build`. This may take 10-20 minutes depending on Pi model.
- **Build on laptop:** Cross-building this compose stack requires building both service images separately and either pushing them to a registry or loading them on the Pi, then changing compose to use `image:` tags. Native build on the Pi is the recommended demo path.
- **Buildx builder:** Recommended to create a named builder: `docker buildx create --name rpi --driver docker-container && docker buildx use rpi`.
- **No architecture forcing:** No `--platform` or `TARGETPLATFORM` constraints in Dockerfiles. Images build natively for the host architecture.

## Cloud Review Fixes Applied

- Fixed `docker-compose.rpi.yml` build contexts from invalid paths to `./backend` and `./frontend`.
- Added `backend/.dockerignore` and `frontend/.dockerignore` for the actual service build contexts.
- Updated `.gitignore` so `.env.docker.example` is trackable.
- Updated Docker commands in docs/report to use `--env-file .env.docker`; compose does not automatically load `.env.docker` for variable interpolation.
- Removed invalid `docker buildx build -f docker-compose.rpi.yml ...` guidance.
- Changed FE-QA-001 impact wording from “resolved” to “addressed for demo design, pending Docker runtime verification.”

## FE-QA-001 Blocker Impact

**Status: ADDRESSED for demo design, pending Docker runtime verification.**

FE-QA-001 was blocked because local Vite dev server at `http://localhost:5173` could not reach `http://127.0.0.1:8000/api` due to `CORS_ALLOWED_ORIGINS = []` in Django settings.

This Docker stack is designed to resolve that blocker by:
1. Building frontend with `VITE_API_BASE_URL=/api`
2. Serving everything through nginx on port 8080
3. Making `/api/...` requests from the browser same-origin (both at `http://<host-ip>:8080/`)
4. Nginx reverse-proxies `/api/` to the backend, so no CORS headers are needed

**Remaining note:** Local Vite development still has the CORS blocker. That is a separate `local-dev` task. This stack is intended to solve the **demo/staging** use case for Raspberry Pi, but Docker could not be run on this machine because Docker is not installed.

## Remaining Blockers / Next Recommended Task

1. **Admin browser QA not yet rerun:** FE-QA-001 browser QA must be rerun in a real browser against the Docker stack once the stack is running. Admin flows require a live superuser session.

2. **Admin mutation CSRF:** Frontend `fetch()` calls do not include CSRF tokens for admin PATCH/POST. When an admin login UI and auth strategy are implemented, CSRF handling must also be added.

3. **HTTPS not configured:** The nginx frontend serves only HTTP. TLS termination should be added if the demo will be exposed on a LAN.

4. **Healthcheck/restart policy:** Docker compose does not include `healthcheck` or `restart` directives for production readiness.

5. **PostgreSQL migration path:** This stack uses SQLite. A production Docker compose with PostgreSQL should be created separately.

**Recommended next task:** Deploy this Docker stack on the Raspberry Pi and rerun the FE-QA-001 browser QA walkthrough to verify all public and admin flows work end-to-end.
