import os
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from db.client import init_db
from routers import chat, stripe, upload, users, videos
from routers import websocket as ws

if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=0.1,
        environment=os.getenv("ENV", "development"),
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="VFXB API",
    version="1.0.0",
    description="AI Video Intelligence Platform",
    lifespan=lifespan,
    docs_url="/docs" if os.getenv("ENV") != "production" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "https://vfxb.ai"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(videos.router, prefix="/api", tags=["videos"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(ws.router, tags=["websocket"])
app.include_router(stripe.router, prefix="/api", tags=["stripe"])


@app.get("/health", include_in_schema=False)
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if os.getenv("SENTRY_DSN"):
        sentry_sdk.capture_exception(exc)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "code": "INTERNAL_ERROR"},
    )
