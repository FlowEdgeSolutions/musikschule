import base64
import hashlib
import hmac
import json
import time
from typing import Any

from fastapi import HTTPException, Request, Response, status

from app.config import get_settings


settings = get_settings()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str) -> bool:
    expected_hash = settings.admin_password_hash.strip()
    if not expected_hash:
        return False
    return hmac.compare_digest(hash_password(password), expected_hash)


def _b64encode(payload: bytes) -> str:
    return base64.urlsafe_b64encode(payload).rstrip(b"=").decode("ascii")


def _b64decode(payload: str) -> bytes:
    padding = "=" * (-len(payload) % 4)
    return base64.urlsafe_b64decode((payload + padding).encode("ascii"))


def create_admin_token() -> str:
    now = int(time.time())
    payload = {
        "sub": "admin",
        "iat": now,
        "exp": now + settings.admin_session_seconds,
    }
    body = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(settings.admin_session_secret.encode("utf-8"), body.encode("ascii"), hashlib.sha256)
    return f"{body}.{_b64encode(signature.digest())}"


def verify_admin_token(token: str) -> dict[str, Any]:
    try:
        body, signature = token.split(".", 1)
        expected = hmac.new(settings.admin_session_secret.encode("utf-8"), body.encode("ascii"), hashlib.sha256)
        if not hmac.compare_digest(_b64encode(expected.digest()), signature):
            raise ValueError("bad signature")
        payload = json.loads(_b64decode(body))
        if payload.get("sub") != "admin" or int(payload.get("exp", 0)) < int(time.time()):
            raise ValueError("expired")
        return payload
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized") from exc


def set_admin_cookie(response: Response, token: str) -> None:
    secure_cookie = settings.app_env == "production"
    response.set_cookie(
        settings.admin_cookie_name,
        token,
        httponly=True,
        secure=secure_cookie,
        samesite="lax",
        max_age=settings.admin_session_seconds,
        path="/",
    )


def clear_admin_cookie(response: Response) -> None:
    response.delete_cookie(settings.admin_cookie_name, path="/")


def require_admin(request: Request) -> dict[str, Any]:
    authorization = request.headers.get("authorization", "")
    token = ""
    if authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()
    if not token:
        token = request.cookies.get(settings.admin_cookie_name, "")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return verify_admin_token(token)
