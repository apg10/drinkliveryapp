# Deploy 001 — Raspberry Pi, GitHub, Cloudflare

## Branch Pushed

- Branch: `codex/raspberry-pi-docker-demo`
- Remote: `origin git@github.com:apg10/drinkliveryapp.git`

## Push Result

```
Everything up-to-date
```

Branch was already at HEAD.

## Raspberry SSH Target

`adrianp1024@adrian10.local`

### Commands Run on Pi

```bash
# 1. Git status
ssh adrianp1024@adrian10.local 'cd /home/adrianp1024/projects-backup/drinkliveryapp && git status -sb'
# Result: ## codex/raspberry-pi-docker-demo...origin/codex/raspberry-pi-docker-demo (clean)

# 2. Fetch
ssh adrianp1024@adrian10.local 'cd /home/adrianp1024/projects-backup/drinkliveryapp && git fetch origin'
# Result: 2325585..ee966da codex/raspberry-pi-docker-demo -> origin/codex/raspberry-pi-docker-demo

# 3. Checkout + pull (fast-forward)
ssh adrianp1024@adrian10.local 'cd /home/adrianp1024/projects-backup/drinkliveryapp && git checkout codex/raspberry-pi-docker-demo && git pull --ff-only origin codex/raspberry-pi-docker-demo'
# Result: Fast-forward, 4 files changed, 1216 insertions(+), 221 deletions(-)

# 4. Docker build
ssh adrianp1024@adrian10.local 'cd /home/adrianp1024/projects-backup/drinkliveryapp && docker compose --env-file .env.docker -f docker-compose.rpi.yml build'
# Result: Both images built successfully (backend + frontend)

# 5. Docker up
ssh adrianp1024@adrian10.local 'cd /home/adrianp1024/projects-backup/drinkliveryapp && docker compose --env-file .env.docker -f docker-compose.rpi.yml up -d'
# Result: Containers recrated and started

# 6. Docker ps
ssh adrianp1024@adrian10.local 'cd /home/adrianp1024/projects-backup/drinkliveryapp && docker compose --env-file .env.docker -f docker-compose.rpi.yml ps'
# Result:
# drinkliveryapp-backend-1   drinkliveryapp-backend   ...   backend   Up
# drinkliveryapp-frontend-1  drinkliveryapp-frontend  ...   frontend   Up   0.0.0.0:8080->80/tcp
```

## Docker Compose Result

BUILD: Success  
UP: Success (both services running)  
Services: `backend` (8000/tcp), `frontend` (0.0.0.0:8080->80/tcp)

## Local Pi Health Result

### Health endpoint (from Pi)
```
curl -f http://127.0.0.1:8080/api/health/
# {"status": "ok", "service": "drinklivery-backend"}
```

### Catalog endpoint (from Pi)
```
curl -f http://127.0.0.1:8080/api/public/drinklivery-panama/catalog/
# {"categories": [{"id": 1, "name": "Cocktail Packs", ...}, {"id": 2, "name": "Mocktails", ...}]}
```

## Public Cloudflare Health Result

### Health endpoint (Cloudflare)
```
curl -f https://pages-mason-ago-references.trycloudflare.com/api/health/
# {"status": "ok", "service": "drinklivery-backend"}
```

### Catalog endpoint (Cloudflare)
```
curl -f https://pages-mason-ago-references.trycloudflare.com/api/public/drinklivery-panama/catalog/
# {"categories": [{"id": 1, "name": "Cocktail Packs", ...}, {"id": 2, "name": "Mocktails", ...}]}
```

Both Cloudflare endpoints returned successful responses with valid data.

## Blockers / Risks

- No blockers. All steps completed successfully.
- The `version` attribute in `docker-compose.rpi.yml` is obsolete and will be removed in a follow-up task to silence warnings.
- No healthcheck probes or restart policies configured in Docker Compose (documented in 22-DOCKER-RPI.md limitations).
