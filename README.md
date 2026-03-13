# VFXB Team README

VFXB is a monorepo for an AI-assisted video editing platform. This repository currently contains:

- `apps/web`: Vite + React frontend
- `apps/api`: FastAPI backend
- `apps/worker`: Python RQ worker for background jobs
- `back/server`: Node/Express auth and account server
- `packages/types`: shared TypeScript types

## Current Status

The repository has been stabilized enough to boot the full Docker stack locally.

Working now:

- `docker compose up --build -d` starts `web`, `api`, `worker`, and `redis`
- frontend is served on `http://localhost:5173`
- FastAPI health endpoint responds on `http://localhost:8000/health`
- Redis and the RQ worker are running inside Docker
- Node auth server under `back/server` can also run locally when needed
- several Pylance/type issues in API and worker code have already been fixed
- Gemini support was wired into the Python chat parser as an available model path

Known gaps:

- root `.env` still contains placeholder Supabase values in some fields
- database-backed API features will not fully work until valid Supabase credentials are supplied
- some features depend on external services being correctly configured: Supabase, R2, Stripe, AssemblyAI, Google, Anthropic/OpenAI
- the Node server in `back/server` is separate from the FastAPI stack and should be treated as an additional service, not part of the Docker compose stack yet

## What Has Already Been Done

The following setup and fixes are already in place:

1. Environment wiring

- root `.env` was updated with frontend-facing variables and AI keys
- `back/server/.env` was updated for MongoDB, JWT, email, and Google auth

2. Frontend boot fixes

- unresolved `figma:asset/...` imports were replaced so Vite can resolve assets locally
- frontend now boots correctly in development

3. Backend stability fixes

- FastAPI startup was made more tolerant when Supabase is missing or invalid
- rate limiting already has in-memory fallback if Redis is unavailable
- queue-related endpoints were made less brittle when worker infrastructure is missing
- multiple type-checking issues in `stripe.py`, `users.py`, `chat.py`, `plan_check.py`, `virality_score.py`, `visual_analysis.py`, and `ffmpeg_executor.py` were fixed

4. Chat model routing

- backend chat parsing now supports Gemini routing and fallback behavior
- frontend chat store agent values were aligned with backend allowed agent names

## What Still Needs To Be Done

These are the main items the team should address next.

### Required for real functionality

- replace placeholder Supabase credentials in root `.env`
- verify database schema in Supabase matches what the API expects
- configure valid Cloudflare R2 credentials and public URL
- configure valid Stripe product and webhook settings
- verify Google OAuth configuration for both frontend and backend
- verify whichever AI providers you actually want active in production

### Recommended engineering follow-up

- decide whether `back/server` remains a separate service or gets consolidated with the main API
- add a real root test and validation workflow for the monorepo
- add CI for type-checking, linting, and container smoke tests
- audit secret handling and rotate any keys that were exposed during local setup
- document Supabase schema and seed requirements
- add production deployment docs for web, API, worker, Redis, and auth server

## Required Environment Variables

At minimum, these must be valid for the main stack to work correctly:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `VITE_API_URL`
- `REDIS_URL`
- `CLOUDFLARE_R2_ACCESS_KEY`
- `CLOUDFLARE_R2_SECRET_KEY`
- `CLOUDFLARE_R2_BUCKET_VIDEOS`
- `CLOUDFLARE_R2_BUCKET_EXPORTS`
- one or more AI keys such as `GOOGLE_AI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`

If `back/server` is used, these must also be valid:

- `MONGO_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CLIENT_URL`

## How To Run

### Recommended: Docker

Use this from the repo root:

```powershell
docker compose up --build -d
```

Check status:

```powershell
docker compose ps
```

Stop everything:

```powershell
docker compose down
```

Useful logs:

```powershell
docker compose logs api --tail 100
docker compose logs worker --tail 100
docker compose logs web --tail 100
docker compose logs redis --tail 100
```

Expected local ports:

- `5173`: frontend
- `8000`: FastAPI API
- `6379`: Redis

### Local run without Docker

#### 1. Frontend

From repo root:

```powershell
pnpm install
pnpm --filter @figma/my-make-file dev
```

#### 2. FastAPI API

From repo root:

```powershell
Push-Location apps/api
C:/Users/zubay/AppData/Local/Programs/Python/Python311/python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
Pop-Location
```

#### 3. Worker

Requires Redis to be running first.

```powershell
Push-Location apps/worker
C:/Users/zubay/AppData/Local/Programs/Python/Python311/python.exe worker.py
Pop-Location
```

#### 4. Node auth server

```powershell
Push-Location back/server
npm install
npm run dev
Pop-Location
```

Default local port:

- `5000`: Node auth server

## Quick Verification

After startup, check:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8000/health
Invoke-WebRequest -UseBasicParsing http://localhost:5173
docker compose ps
```

You should see:

- API health returning JSON with `status: ok`
- frontend returning HTTP 200
- Docker services `api`, `web`, `redis`, and `worker` in `Up` state

## Repo Notes For Team Members

- Use `docker compose`, not `compose`
- root `.env` is intentionally ignored by git
- do not commit real credentials
- if a service starts but a feature still fails, check logs first before changing code
- the fastest smoke test is `docker compose up --build -d` followed by `docker compose ps`

## Suggested Next Owner Tasks

1. Replace placeholder Supabase values and verify `/api/users/me` against the real database.
2. Test a full upload -> analyze -> chat -> edit flow with real storage credentials.
3. Decide whether `back/server` stays separate or is folded into the main stack.
4. Rotate any credentials that were used in local development and should not persist.