import logging
import os
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel

logger = logging.getLogger(__name__)

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")


class AuthUser(BaseModel):
    id: str
    email: str
    role: str = "authenticated"


def _decode_supabase_jwt(token: str) -> dict:
    """
    Decode and verify a Supabase JWT.
    Supabase uses HS256 with the project JWT secret.
    """
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
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
    FastAPI dependency that validates the Supabase JWT from the
    Authorization header and returns the authenticated user.
    """
    payload = _decode_supabase_jwt(credentials.credentials)

    user_id = payload.get("sub")
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
