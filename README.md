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

- root `.env` must contain valid Mongo/JWT and external service credentials
- database-backed API features require `MONGO_URL` and `JWT_SECRET` to be valid
- some features depend on external services being correctly configured: MongoDB, R2, Stripe, AssemblyAI, Google, Anthropic/OpenAI
- ensure auth server, API, and web share consistent JWT/auth configuration

## Backend Features Added

The current backend work already includes the main building blocks for upload, analysis, chat-based editing, billing, and background processing.

### 1. Upload and storage flow

Added in the FastAPI backend:

- presigned upload URL generation for direct browser-to-R2 uploads
- upload validation for supported video types, size, and platform
- upload completion endpoint that marks a video as processing
- URL import entrypoint for YouTube, Google Drive, and Dropbox sources
- Cloudflare R2 storage helpers for upload, download, public URL generation, and object key generation

### 2. Video analysis pipeline

Added in the worker/backend:

- transcription stage
- visual frame analysis stage
- audio analysis stage
- virality scoring stage
- orchestrated background pipeline that downloads source media, runs all analysis steps, saves results, and updates video status

### 3. Chat-based edit engine

Added in the backend:

- SSE chat streaming endpoint
- conversation history persistence
- edit plan creation and confirmation flow
- Gemini-capable NLP parser path with model routing support
- queue handoff for edit execution

### 4. Edit execution and progress tracking

Added in the worker/backend:

- FFmpeg edit job runner
- support for silence cutting, trim range, speed changes, captions, platform export, color grading, and clip extraction
- edit progress metadata through RQ jobs
- WebSocket endpoint for real-time edit status updates

### 5. User, plan, and billing support

Added in the backend:

- authenticated user profile endpoints
- first-login user creation flow
- plan-based quota checking
- Stripe checkout session creation
- Stripe billing portal session creation
- Stripe webhook processing for subscription state updates

### 6. Infra and resilience improvements

Added or improved:

- Dockerized `api`, `worker`, `web`, and `redis`
- API startup no longer hard-fails immediately when DB is temporarily unavailable
- in-memory rate-limit fallback when Redis is unavailable
- safer handling for queue-unavailable states in upload/edit endpoints
- multiple backend type-check and Pylance fixes across routers and worker steps

## Backend Functions Available

This is the current backend function surface available to the team.

### FastAPI routes

User routes:

- `GET /api/users/me`: get current user profile
- `PATCH /api/users/me`: update user profile fields
- `POST /api/users/ensure`: create the app user record after auth

Upload routes:

- `POST /api/upload/presigned`: request presigned upload URL
- `POST /api/upload/complete`: finalize upload and trigger analysis queue
- `POST /api/upload/from-url`: create import job from supported external URL

Video routes:

- `GET /api/videos`: list videos for current user
- `GET /api/videos/{video_id}`: get full video detail
- `DELETE /api/videos/{video_id}`: delete video and related data
- `GET /api/videos/{video_id}/edits`: list edits for a video
- `GET /api/videos/{video_id}/analysis`: get analysis payload and score data
- `GET /api/stats`: return dashboard summary stats

Chat routes:

- `POST /api/chat/message`: stream AI chat response over SSE
- `POST /api/chat/confirm-edit`: confirm or cancel a pending AI edit plan
- `GET /api/chat/history/{video_id}`: fetch stored chat history for a video

Stripe routes:

- `POST /api/stripe/create-checkout`: create checkout session
- `GET /api/stripe/portal`: create billing portal session
- `POST /api/stripe/webhook`: Stripe webhook receiver

Realtime route:

- `WS /ws/edit-status/{job_id}`: stream edit progress updates to the frontend

Utility route:

- `GET /health`: API health check

### Worker functions

Analysis worker functions:

- `steps.analyze_pipeline.run`: full analysis pipeline entrypoint
- `steps.transcribe.transcribe_video`: transcription stage
- `steps.visual_analysis.analyze_visual`: visual frame analysis stage
- `steps.audio_analysis.analyze_audio`: audio analysis stage
- `steps.virality_score.calculate_virality_score`: virality scoring stage

Edit worker functions:

- `services.ffmpeg_executor.run_edit`: main edit job entrypoint
- `cut_silence`
- `trim_range`
- `change_speed`
- `add_captions`
- `platform_export`
- `color_grade`
- `extract_best_clip`

Storage helper functions:

- `generate_presigned_upload_url`
- `generate_presigned_download_url`
- `upload_file`
- `upload_fileobj`
- `download_file`
- `delete_object`
- `make_video_key`
- `make_export_key`

## Backend Work Still Needed

The backend is not finished. These are the main remaining tasks.

### Required to make the backend fully functional

- set valid `MONGO_URL` and `JWT_SECRET`
- verify Mongo collections used by the API exist and hold required fields: `users`, `videos`, `edits`, `chat_messages`, `subscriptions`
- configure valid R2 buckets and public delivery URL
- verify AssemblyAI/OpenAI/Anthropic/Gemini keys based on the models we actually want to use
- verify Stripe product IDs and webhook secret

### Required to make the backend production-ready

- add proper integration tests for upload, chat, billing, and edit flows
- add schema migration documentation and seed data instructions
- add stronger error classification and structured logging
- audit auth flow consistency between web auth store, Node auth server, and FastAPI JWT middleware
- decide whether `back/server` should remain separate or be merged/replaced
- add production deployment configuration for API and worker services

### Likely implementation gaps still to close

- complete end-to-end validation of upload -> analyze -> chat -> confirm edit -> worker execution
- confirm websocket progress updates against real queued edit jobs
- add retry and dead-letter handling for failed jobs
- review quota enforcement and subscription transitions against real billing events
- review fallback behavior when Redis, Mongo, or AI providers are partially unavailable

## What Has Already Been Done

The following setup and fixes are already in place:

1. Environment wiring

- root `.env` was updated with frontend-facing variables and AI keys
- `back/server/.env` was updated for MongoDB, JWT, email, and Google auth

2. Frontend boot fixes

- unresolved `figma:asset/...` imports were replaced so Vite can resolve assets locally
- frontend now boots correctly in development

3. Backend stability fixes

- FastAPI startup was made more tolerant when DB connectivity is missing or invalid
- rate limiting already has in-memory fallback if Redis is unavailable
- queue-related endpoints were made less brittle when worker infrastructure is missing
- multiple type-checking issues in `stripe.py`, `users.py`, `chat.py`, `plan_check.py`, `virality_score.py`, `visual_analysis.py`, and `ffmpeg_executor.py` were fixed

4. Chat model routing

- backend chat parsing now supports Gemini routing and fallback behavior
- frontend chat store agent values were aligned with backend allowed agent names

## What Still Needs To Be Done

These are the main items the team should address next.

### Required for real functionality

- set valid Mongo/JWT credentials in root `.env`
- verify Mongo collections and required document fields match what the API expects
- configure valid Cloudflare R2 credentials and public URL
- configure valid Stripe product and webhook settings
- verify Google OAuth configuration for both frontend and backend
- verify whichever AI providers you actually want active in production

### Recommended engineering follow-up

- decide whether `back/server` remains a separate service or gets consolidated with the main API
- add a real root test and validation workflow for the monorepo
- add CI for type-checking, linting, and container smoke tests
- audit secret handling and rotate any keys that were exposed during local setup
- document Mongo collection schema and seed requirements
- add production deployment docs for web, API, worker, Redis, and auth server

## Required Environment Variables

At minimum, these must be valid for the main stack to work correctly:

- `MONGO_URL`
- `JWT_SECRET`
- `VITE_API_URL`
- `VITE_AUTH_API_URL`
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

1. Validate Mongo/JWT credentials and verify `/api/users/ensure` then `/api/users/me` against the live database.
2. Test a full upload -> analyze -> chat -> edit flow with real storage credentials.
3. Decide whether `back/server` stays separate or is folded into the main stack.
4. Rotate any credentials that were used in local development and should not persist.