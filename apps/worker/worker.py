"""
VFXB Worker — RQ-based background job processor.
Connects to Redis, registers job queues, and starts workers.
Run: python worker.py
"""
import logging
import os
import sys

import redis as redis_lib
import sentry_sdk
from rq import Queue, Worker

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)

if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=0.1,
        environment=os.getenv("ENV", "development"),
    )

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

if __name__ == "__main__":
    conn = redis_lib.from_url(REDIS_URL, decode_responses=False)

    # Listen to all queues in priority order
    queues = [
        Queue("analyze", connection=conn),
        Queue("edit", connection=conn),
        Queue("export", connection=conn),
        Queue("default", connection=conn),
    ]

    logger.info(f"Worker started — listening to: {[q.name for q in queues]}")

    worker = Worker(queues, connection=conn)
    worker.work(with_scheduler=True)
