from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app import models, schemas
from app.db import get_db

router = APIRouter(prefix="/api", tags=["public"])


def _site_or_404(db: Session) -> models.SiteContent:
    site = db.get(models.SiteContent, 1)
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site content not found")
    return site


@router.get("/content", response_model=schemas.CmsSnapshotOut)
def get_content(db: Session = Depends(get_db)) -> schemas.CmsSnapshotOut:
    site = _site_or_404(db)
    events = db.scalars(
        select(models.Event).where(models.Event.status == "published").order_by(models.Event.created_at)
    ).all()
    posts = db.scalars(
        select(models.Post).where(models.Post.status == "published").order_by(desc(models.Post.published_at))
    ).all()
    return schemas.CmsSnapshotOut(
        site=site,
        events=list(events),
        posts=list(posts),
        tickets=[],
        updated_at=site.updated_at or datetime.now(timezone.utc),
    )


@router.get("/site", response_model=schemas.SiteContentOut)
def get_site(db: Session = Depends(get_db)) -> models.SiteContent:
    return _site_or_404(db)


@router.get("/events", response_model=list[schemas.EventOut])
def list_events(db: Session = Depends(get_db)) -> list[models.Event]:
    return list(
        db.scalars(select(models.Event).where(models.Event.status == "published").order_by(models.Event.created_at))
    )


@router.get("/posts", response_model=list[schemas.PostOut])
def list_posts(db: Session = Depends(get_db)) -> list[models.Post]:
    return list(db.scalars(select(models.Post).where(models.Post.status == "published").order_by(desc(models.Post.published_at))))


@router.post("/tickets", status_code=status.HTTP_201_CREATED)
def create_ticket(payload: schemas.TicketCreate, db: Session = Depends(get_db)) -> dict[str, bool]:
    event = db.get(models.Event, payload.event_id)
    if not event or event.status != "published" or not event.ticket_enabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Diese Veranstaltung ist nicht reservierbar.")

    ticket = models.TicketRequest(
        event_id=event.id,
        event_title=event.title,
        name=payload.name.strip(),
        email=payload.email.strip(),
        phone=payload.phone.strip(),
        quantity=payload.quantity,
        note=payload.note.strip(),
        status="new",
    )
    db.add(ticket)
    db.commit()
    return {"ok": True}
