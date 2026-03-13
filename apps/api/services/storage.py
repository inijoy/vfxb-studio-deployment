import hashlib
import logging
import os
import re
import uuid
from pathlib import Path
from typing import IO

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

# Cloudflare R2 is S3-compatible — uses the account-specific endpoint
ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
R2_ENDPOINT = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"
R2_ACCESS_KEY = os.getenv("CLOUDFLARE_R2_ACCESS_KEY", "")
R2_SECRET_KEY = os.getenv("CLOUDFLARE_R2_SECRET_KEY", "")
BUCKET_VIDEOS = os.getenv("CLOUDFLARE_R2_BUCKET_VIDEOS", "vfxb-videos")
BUCKET_EXPORTS = os.getenv("CLOUDFLARE_R2_BUCKET_EXPORTS", "vfxb-exports")
PUBLIC_URL = os.getenv("CLOUDFLARE_R2_PUBLIC_URL", "")

_s3_client = None


def _get_s3():
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client(
            "s3",
            endpoint_url=R2_ENDPOINT,
            aws_access_key_id=R2_ACCESS_KEY,
            aws_secret_access_key=R2_SECRET_KEY,
            config=Config(signature_version="s3v4"),
        )
    return _s3_client


def _sanitize_key(filename: str) -> str:
    """Strip dangerous characters from an R2 object key."""
    # Remove path traversal sequences
    filename = re.sub(r"\.\./", "", filename)
    filename = re.sub(r"[^\w\-_\.]", "_", filename)
    return filename[:200]  # max 200 chars


def make_video_key(user_id: str, filename: str) -> str:
    safe_name = _sanitize_key(filename)
    unique_id = uuid.uuid4().hex[:8]
    return f"uploads/{user_id}/{unique_id}_{safe_name}"


def make_export_key(user_id: str, video_id: str, platform: str, fmt: str) -> str:
    return f"exports/{user_id}/{video_id}/{platform}.{fmt}"


def generate_presigned_upload_url(
    key: str, content_type: str, max_file_size_bytes: int = 10 * 1024 * 1024 * 1024
) -> str:
    """
    Generate a presigned PUT URL for direct browser-to-R2 upload.
    Max 10 GB by default.
    """
    s3 = _get_s3()
    url = s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": BUCKET_VIDEOS,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=3600,  # 1 hour
    )
    return url


def generate_presigned_download_url(key: str, bucket: str = BUCKET_VIDEOS) -> str:
    """Generate a presigned GET URL for temporary file access."""
    s3 = _get_s3()
    url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=86400,  # 24 hours
    )
    return url


def get_public_url(key: str) -> str:
    """Return the CDN-based public URL for an R2 object."""
    return f"{PUBLIC_URL.rstrip('/')}/{key}"


def upload_file(
    file_path: str | Path,
    key: str,
    content_type: str = "video/mp4",
    bucket: str = BUCKET_VIDEOS,
) -> str:
    """Upload a local file to R2 and return its public URL."""
    s3 = _get_s3()
    with open(file_path, "rb") as f:
        s3.upload_fileobj(
            f,
            bucket,
            key,
            ExtraArgs={"ContentType": content_type},
        )
    logger.info(f"Uploaded {key} to bucket {bucket}")
    return get_public_url(key)


def upload_fileobj(
    fileobj: IO[bytes],
    key: str,
    content_type: str = "video/mp4",
    bucket: str = BUCKET_VIDEOS,
) -> str:
    """Upload a file-like object to R2 and return its public URL."""
    s3 = _get_s3()
    s3.upload_fileobj(
        fileobj,
        bucket,
        key,
        ExtraArgs={"ContentType": content_type},
    )
    logger.info(f"Uploaded fileobj to {key}")
    return get_public_url(key)


def download_file(key: str, local_path: str, bucket: str = BUCKET_VIDEOS) -> None:
    """Download an R2 object to a local path."""
    s3 = _get_s3()
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    s3.download_file(bucket, key, local_path)
    logger.info(f"Downloaded {key} to {local_path}")


def delete_object(key: str, bucket: str = BUCKET_VIDEOS) -> None:
    """Delete an object from R2."""
    s3 = _get_s3()
    try:
        s3.delete_object(Bucket=bucket, Key=key)
    except ClientError as e:
        logger.warning(f"Failed to delete {key}: {e}")
