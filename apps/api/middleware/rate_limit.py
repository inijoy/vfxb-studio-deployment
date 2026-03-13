import time
from collections import defaultdict, deque
from typing import Annotated

import redis as redis_lib
from fastapi import Depends, HTTPException, Request, status

from middleware.auth import CurrentUser

# In-memory fallback if Redis is unavailable
_memory_store: dict[str, deque] = defaultdict(deque)

_redis_client: redis_lib.Redis | None = None


def _get_redis() -> redis_lib.Redis | None:
    global _redis_client
    if _redis_client is None:
        import os
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        try:
            _redis_client = redis_lib.from_url(redis_url, decode_responses=True)
            _redis_client.ping()
        except Exception:
            _redis_client = None
    return _redis_client


def _check_rate_limit_memory(key: str, limit: int, window_seconds: int) -> bool:
    """Sliding window rate limit using in-process memory."""
    now = time.time()
    window = _memory_store[key]

    # Remove timestamps outside the window
    while window and window[0] < now - window_seconds:
        window.popleft()

    if len(window) >= limit:
        return False

    window.append(now)
    return True


def _check_rate_limit_redis(
    r: redis_lib.Redis, key: str, limit: int, window_seconds: int
) -> bool:
    """Sliding window rate limit using Redis sorted sets."""
    now = time.time()
    pipe = r.pipeline()
    pipe.zremrangebyscore(key, 0, now - window_seconds)
    pipe.zadd(key, {str(now): now})
    pipe.zcard(key)
    pipe.expire(key, window_seconds + 1)
    results = pipe.execute()
    count = results[2]
    return count <= limit


def rate_limit(limit: int = 20, window_seconds: int = 60):
    """
    Factory that returns a FastAPI dependency enforcing a sliding-window
    rate limit of `limit` requests per `window_seconds` per user.
    """

    async def _dependency(request: Request, user: CurrentUser) -> None:
        key = f"rl:{request.url.path}:{user.id}"
        r = _get_redis()

        if r:
            allowed = _check_rate_limit_redis(r, key, limit, window_seconds)
        else:
            allowed = _check_rate_limit_memory(key, limit, window_seconds)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={"Retry-After": str(window_seconds)},
            )

    return _dependency
