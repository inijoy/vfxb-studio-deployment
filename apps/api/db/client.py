import logging
from functools import lru_cache

from pydantic_settings import BaseSettings
from supabase import Client, create_client

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


_client: Client | None = None


def get_db() -> Client:
    """Return the singleton Supabase admin client (service role key)."""
    global _client
    if _client is None:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_service_key:
            raise RuntimeError(
                "Missing Supabase configuration: set SUPABASE_URL and SUPABASE_SERVICE_KEY"
            )
        _client = create_client(settings.supabase_url, settings.supabase_service_key)
    return _client


async def init_db() -> None:
    """Called at application startup — verifies DB connectivity."""
    try:
        db = get_db()
        db.table("users").select("id").limit(1).execute()
        logger.info("Database connection verified")
    except Exception as e:
        logger.warning(f"Database connection unavailable at startup: {e}")
