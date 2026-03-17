import logging
from functools import lru_cache
from datetime import datetime, timezone
from typing import Any

from pydantic_settings import BaseSettings
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import PyMongoError

try:
    from bson import ObjectId
except Exception:  # pragma: no cover
    ObjectId = None

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    mongo_url: str = ""
    mongo_db_name: str = "vfx_db"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _maybe_object_id(value: Any):
    if not isinstance(value, str) or ObjectId is None:
        return None
    try:
        return ObjectId(value)
    except Exception:
        return None


def _normalize_doc(doc: dict[str, Any]) -> dict[str, Any]:
    normalized = dict(doc)
    raw_id = normalized.get("_id")
    if raw_id is not None:
        normalized["_id"] = str(raw_id)
        normalized.setdefault("id", str(raw_id))
    return normalized


class QueryResult:
    def __init__(self, data: Any = None):
        self.data = data


class MongoQueryBuilder:
    def __init__(self, collection: Collection):
        self.collection = collection
        self._mode = "select"
        self._filter: dict[str, Any] = {}
        self._projection: dict[str, int] | None = None
        self._single = False
        self._limit: int | None = None
        self._skip: int | None = None
        self._sort: tuple[str, int] | None = None
        self._insert_docs: list[dict[str, Any]] = []
        self._update_doc: dict[str, Any] | None = None
        self._upsert_doc: dict[str, Any] | None = None
        self._upsert_key: str | None = None

    def _merge_filter(self, extra: dict[str, Any]):
        self._filter.update(extra)

    def select(self, columns: str = "*"):
        self._mode = "select"
        cols = [c.strip() for c in columns.split(",")]
        if columns.strip() == "*":
            self._projection = None
        else:
            self._projection = {c: 1 for c in cols if c}
            self._projection.setdefault("_id", 1)
        return self

    def eq(self, field: str, value: Any):
        if field == "id":
            oid = _maybe_object_id(value)
            if self.collection.name == "users" and oid is not None:
                self._merge_filter({"$or": [{"id": value}, {"_id": oid}]})
            elif self.collection.name == "users":
                self._merge_filter({"id": value})
            else:
                self._merge_filter({"id": value})
            return self
        self._merge_filter({field: value})
        return self

    def single(self):
        self._single = True
        self._limit = 1
        return self

    def limit(self, n: int):
        self._limit = n
        return self

    def range(self, start: int, end: int):
        self._skip = start
        self._limit = max(0, end - start + 1)
        return self

    def order(self, field: str, desc: bool = False):
        self._sort = (field, -1 if desc else 1)
        return self

    def insert(self, docs: dict[str, Any] | list[dict[str, Any]]):
        self._mode = "insert"
        if isinstance(docs, list):
            self._insert_docs = docs
        else:
            self._insert_docs = [docs]
        return self

    def update(self, doc: dict[str, Any]):
        self._mode = "update"
        self._update_doc = doc
        return self

    def delete(self):
        self._mode = "delete"
        return self

    def upsert(self, doc: dict[str, Any], on_conflict: str = "id"):
        self._mode = "upsert"
        self._upsert_doc = doc
        self._upsert_key = on_conflict
        return self

    def execute(self) -> QueryResult:
        if self._mode == "select":
            cursor = self.collection.find(self._filter, self._projection)
            if self._sort:
                cursor = cursor.sort([self._sort])
            if self._skip is not None:
                cursor = cursor.skip(self._skip)
            if self._limit is not None:
                cursor = cursor.limit(self._limit)
            docs = [_normalize_doc(d) for d in cursor]
            return QueryResult(docs[0] if self._single else docs)

        if self._mode == "insert":
            payload = []
            for d in self._insert_docs:
                item = dict(d)
                item.setdefault("created_at", _now_iso())
                item.setdefault("updated_at", _now_iso())
                payload.append(item)
            if len(payload) == 1:
                self.collection.insert_one(payload[0])
            else:
                self.collection.insert_many(payload)
            return QueryResult(payload)

        if self._mode == "update":
            update_doc = dict(self._update_doc or {})
            update_doc.setdefault("updated_at", _now_iso())
            self.collection.update_many(self._filter, {"$set": update_doc})
            cursor = self.collection.find(self._filter)
            docs = [_normalize_doc(d) for d in cursor]
            return QueryResult(docs[0] if self._single else docs)

        if self._mode == "delete":
            self.collection.delete_many(self._filter)
            return QueryResult([])

        if self._mode == "upsert":
            doc = dict(self._upsert_doc or {})
            key = self._upsert_key or "id"
            if key not in doc:
                raise RuntimeError(f"upsert doc missing conflict key '{key}'")
            doc.setdefault("updated_at", _now_iso())
            self.collection.update_one({key: doc[key]}, {"$set": doc}, upsert=True)
            out = self.collection.find_one({key: doc[key]})
            return QueryResult(_normalize_doc(out) if out else None)

        return QueryResult(None)


class MongoDBAdapter:
    def __init__(self, db):
        self._db = db

    def table(self, name: str) -> MongoQueryBuilder:
        return MongoQueryBuilder(self._db[name])


_client: MongoDBAdapter | None = None
_mongo_raw_client: MongoClient | None = None


def get_db() -> MongoDBAdapter:
    """Return the singleton MongoDB adapter client."""
    global _client, _mongo_raw_client
    if _client is None:
        settings = get_settings()
        if not settings.mongo_url:
            raise RuntimeError(
                "Missing MongoDB configuration: set MONGO_URL"
            )
        raw_client = MongoClient(settings.mongo_url)
        _mongo_raw_client = raw_client
        db = raw_client[settings.mongo_db_name]
        _client = MongoDBAdapter(db)
    return _client


def increment_videos_used(user_id: str, delta: int) -> None:
    db = get_db()
    users = db.table("users").collection
    oid = _maybe_object_id(user_id)
    q = {"id": user_id}
    if oid is not None:
        q = {"$or": [{"id": user_id}, {"_id": oid}]}
    users.update_many(q, {"$inc": {"videos_used": delta}, "$set": {"updated_at": _now_iso()}})


async def init_db() -> None:
    """Called at application startup — verifies DB connectivity."""
    try:
        db = get_db()
        db.table("users").select("id").limit(1).execute()
        logger.info("Database connection verified")
    except PyMongoError as e:
        logger.warning(f"Database connection unavailable at startup: {e}")
    except Exception as e:
        logger.warning(f"Database connection unavailable at startup: {e}")
