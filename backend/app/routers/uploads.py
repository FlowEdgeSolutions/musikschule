from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.config import get_settings
from app.db import get_db
from app.security import require_admin

router = APIRouter(prefix="/api/admin", tags=["uploads"])

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


@router.post("/uploads", response_model=schemas.MediaAssetOut, status_code=status.HTTP_201_CREATED)
async def upload_media(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> models.MediaAsset:
    require_admin(request)
    settings = get_settings()

    content_type = file.content_type or ""
    extension = ALLOWED_CONTENT_TYPES.get(content_type)
    if not extension:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")

    asset_id = models.new_id()
    relative_path = Path(asset_id[:2]) / f"{asset_id}{extension}"
    destination = settings.upload_dir / relative_path
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(content)

    url_path = f"/uploads/{relative_path.as_posix()}"
    asset = models.MediaAsset(
        id=asset_id,
        filename=file.filename or f"upload{extension}",
        content_type=content_type,
        path=relative_path.as_posix(),
        url=url_path,
        size=len(content),
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset
