import logging
import os
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel

logger = logging.getLogger(__name__)

security = HTTPBearer()

APP_JWT_SECRET = os.getenv("JWT_SECRET", "")


class AuthUser(BaseModel):
    id: str
    email: str
    role: str = "authenticated"


def decode_auth_jwt(token: str) -> dict:
    """
    Decode and verify JWT from the configured auth server secret.
    """
    candidate_secrets = [s for s in (APP_JWT_SECRET,) if s]
    if not candidate_secrets:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No JWT verification secret configured",
        )

    last_error: JWTError | None = None
    for secret in candidate_secrets:
        try:
            payload = jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
            return payload
        except JWTError as e:
            last_error = e

    try:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from last_error
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> AuthUser:
    """
    FastAPI dependency that validates the Bearer JWT from the
    Authorization header and returns the authenticated user.
    """
    payload = decode_auth_jwt(credentials.credentials)

    user_id = payload.get("sub") or payload.get("id")
    email = payload.get("email", "")
    role = payload.get("role", "authenticated")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user ID",
        )

    return AuthUser(id=user_id, email=email, role=role)


# Convenient type alias for dependency injection
CurrentUser = Annotated[AuthUser, Depends(get_current_user)]
