
# VFXB — AI Video Intelligence Platform

VFXB is an **AI-powered video director** that allows creators to edit videos using **natural language**.

Users upload a video and simply tell the AI what to do:

> “Remove the boring parts and add captions.”

The AI analyzes the entire video and applies edits automatically.

**Core Differentiator:**
Natural-language editing of **longform videos**, powered by multi-model AI analysis.

Target users:

* YouTube creators
* TikTok creators
* Agencies
* Media teams

Target scale:

* **100k users in Year 1**

---

# Architecture Overview

VFXB is built as a **full-stack AI video processing platform** using a monorepo architecture.

```
/vfxb
  /apps
    /web        Next.js frontend
    /api        FastAPI backend
    /worker     background processing jobs
  /packages
    /ui         shared components
    /types      shared TypeScript types
    /utils      shared utilities
  /infra        docker + deployment configs
  /docs         documentation
```

---

# Tech Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Zustand (state)
* Video.js
* Wavesurfer.js
* Konva.js
* SSE streaming

## Backend

* FastAPI (Python)
* Pydantic validation
* Prisma ORM
* Redis + RQ job queue
* ffmpeg-python
* librosa audio analysis
* yt-dlp video import

## AI Models

* Claude 3.5 Sonnet → NLP editing engine
* GPT-4o Vision → frame analysis
* Gemini 2.0 Flash → alternative model
* AssemblyAI → transcription
* Whisper → local fallback
* DALL-E 3 → thumbnails
* Suno → music generation
* ElevenLabs → voice synthesis

## Infrastructure

* Supabase → database + auth
* Cloudflare R2 → video storage
* Upstash Redis → queue + cache
* Vercel → frontend hosting
* Railway → backend + worker
* Stripe → subscriptions
* Sentry → monitoring

---

# Core System Components

## 1. Video Upload

Users upload videos using **resumable uploads (TUS protocol)**.

Storage:

* Cloudflare R2
* CDN delivery

Supported inputs:

* Direct upload
* YouTube URL
* Google Drive
* Dropbox

---

## 2. Video Analysis Pipeline

When a video uploads, a background worker runs the **analysis pipeline**.

Pipeline stages:

### Transcription

AssemblyAI provides:

* word timestamps
* speaker detection
* filler words
* sentiment

### Visual Analysis

Frames are sampled and analyzed by GPT-4o Vision.

Detects:

* faces
* motion
* text on screen
* engagement signals

### Audio Analysis

Using librosa to detect:

* silence gaps
* energy levels
* background noise
* music BPM

### Virality Engine

Claude analyzes all data and outputs:

* virality score (0–100)
* improvement suggestions
* predicted retention curve

---

## 3. NLP Edit Engine (Core Feature)

Users edit videos using **plain English conversation**.

Example commands:

```
Remove all silences
Add captions
Make this TikTok format
Extract the best 30 seconds
```

Claude converts these requests into **structured edit plans** which are executed by **FFmpeg**.

Supported edit operations:

* trim
* silence removal
* speed changes
* captions
* audio replacement
* transitions
* color grading
* platform exports
* clip extraction

---

## 4. Chat-Based Editing Interface

The editing interface is **conversation-driven**.

Flow:

1. User sends instruction
2. AI interprets intent
3. AI proposes edit plan
4. User confirms
5. Worker executes edit
6. Updated video appears

Responses stream via **Server-Sent Events (SSE)**.

---

## 5. Video Studio UI

The Studio is a **two-panel interface**.

Left panel:

* AI chat
* virality insights
* edit suggestions

Right panel:

* video player
* before/after comparison
* feature overlays

Optional advanced tools:

* minimal timeline
* waveform visualization
* caption track

---

# Key Platform Features

### NLP Longform Editing

Edit entire videos through natural language conversation.

### Virality Engine

AI predicts performance and suggests improvements.

### Autonomous Publishing Agent

AI can:

1. analyze video
2. apply fixes
3. generate captions
4. create thumbnail
5. upload to YouTube

### Creator DNA Memory

The system learns a creator’s style and adapts future edits.

### Real-Time Collaboration

Multiple editors can work on the same video simultaneously.

### Platform Optimization

Exports optimized versions for:

* YouTube
* TikTok
* Instagram
* LinkedIn
* Twitter
* Shorts

### Audience Simulation

AI predicts viewer retention curves.

### Enterprise API

Agencies can access VFXB via REST API.

---

# Database Overview

Main tables:

* users
* videos
* edits
* chat_messages
* exports
* subscriptions

Security:

* Supabase Row Level Security (RLS)

---

# Job Processing System

Heavy tasks run in background workers.

Queue types:

* analyze_video
* apply_edit
* export_video
* generate_captions

Workers scale independently from the API.

---

# Deployment

Frontend:

* Vercel

Backend:

* Railway / Render

Worker:

* Railway

Database:

* Supabase PostgreSQL

Queue:

* Upstash Redis

Storage:

* Cloudflare R2

Monitoring:

* Sentry

---

# Local Development

### 1. Create project

```
npx create-turbo@latest vfxb --package-manager pnpm
```

### 2. Install dependencies

```
pnpm install
```

### 3. Start services

```
docker-compose up
```

Services:

```
web     localhost:3000
api     localhost:8000
worker  background queue
redis   localhost:6379
```

---

# Development Roadmap

Week 1

* Project setup
* Auth
* Database

Week 2

* Upload system
* Video analysis pipeline

Week 3

* NLP editing engine

Week 4

* Frontend studio

Week 5

* Payments
* Advanced features

Week 6

* Performance
* Deployment
* Launch

---

# Goal

Build the **first conversational video editing platform** capable of editing **full-length videos using natural language**.

If successful, VFXB becomes the **AI operating system for video creators**.

---
