import os
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.client import init_db
from routers import chat, stripe, upload, users, videos
from routers import websocket as ws

# Initialize Sentry (optional)
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=0.1,
        environment=os.getenv("ENV", "development"),
    )

# Lifespan event (startup tasks)
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

# Create FastAPI app
app = FastAPI(
    title="VFXB API",
    version="1.0.0",
    description="AI Video Intelligence Platform",
    lifespan=lifespan,
    docs_url="/docs" if os.getenv("ENV") != "production" else None,
    redoc_url=None,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://vfxb-studio-frontend.onrender.com",
        os.getenv("FRONTEND_URL", "https://vfxb.ai"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(videos.router, prefix="/api", tags=["videos"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(ws.router, tags=["websocket"])
app.include_router(stripe.router, prefix="/api", tags=["stripe"])
