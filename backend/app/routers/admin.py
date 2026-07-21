from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app import models, schemas
from app.db import get_db
from app.security import clear_admin_cookie, create_admin_token, require_admin, set_admin_cookie, verify_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _touch_site(db: Session) -> models.SiteContent:
    site = db.get(models.SiteContent, 1)
    if not site:
        site = models.SiteContent(id=1)
        db.add(site)
    site.updated_at = datetime.now(timezone.utc)
    return site


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, response: Response) -> schemas.TokenResponse:
    if not verify_password(payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    token = create_admin_token()
    set_admin_cookie(response, token)
    return schemas.TokenResponse(access_token=token)


@router.post("/logout")
def logout(response: Response) -> dict[str, bool]:
    clear_admin_cookie(response)
    return {"ok": True}


@router.get("/me")
def me(request: Request) -> dict[str, str]:
    require_admin(request)
    return {"role": "admin"}


@router.get("/cms", response_model=schemas.CmsSnapshotOut)
def get_cms(request: Request, db: Session = Depends(get_db)) -> schemas.CmsSnapshotOut:
    require_admin(request)
    site = db.get(models.SiteContent, 1)
    if not site:
        site = models.SiteContent(id=1)
        db.add(site)
        db.commit()
        db.refresh(site)

    events = db.scalars(select(models.Event).order_by(models.Event.created_at)).all()
    posts = db.scalars(select(models.Post).order_by(desc(models.Post.published_at))).all()
    tickets = db.scalars(select(models.TicketRequest).order_by(desc(models.TicketRequest.created_at))).all()
    return schemas.CmsSnapshotOut(
        site=site,
        events=list(events),
        posts=list(posts),
        tickets=list(tickets),
        updated_at=site.updated_at or datetime.now(timezone.utc),
    )


@router.put("/cms", response_model=schemas.CmsSnapshotOut)
def replace_cms(payload: schemas.CmsSnapshot, request: Request, db: Session = Depends(get_db)) -> schemas.CmsSnapshotOut:
    require_admin(request)
    site = _touch_site(db)
    for field, value in payload.site.model_dump().items():
        setattr(site, field, value)

    db.query(models.Event).delete()
    db.query(models.Post).delete()

    for event in payload.events:
        db.add(models.Event(**event.model_dump(exclude_none=True)))
    for post in payload.posts:
        db.add(models.Post(**post.model_dump(exclude_none=True)))

    db.commit()
    return get_cms(request, db)


@router.get("/site", response_model=schemas.SiteContentOut)
def get_site(request: Request, db: Session = Depends(get_db)) -> models.SiteContent:
    require_admin(request)
    return _touch_site(db)


@router.put("/site", response_model=schemas.SiteContentOut)
def update_site(payload: schemas.SiteContentIn, request: Request, db: Session = Depends(get_db)) -> models.SiteContent:
    require_admin(request)
    site = _touch_site(db)
    for field, value in payload.model_dump().items():
        setattr(site, field, value)
    db.commit()
    db.refresh(site)
    return site


@router.post("/events", response_model=schemas.EventOut, status_code=status.HTTP_201_CREATED)
def create_event(payload: schemas.EventCreate, request: Request, db: Session = Depends(get_db)) -> models.Event:
    require_admin(request)
    event = models.Event(**payload.model_dump(exclude_none=True))
    db.add(event)
    _touch_site(db)
    db.commit()
    db.refresh(event)
    return event


@router.put("/events/{event_id}", response_model=schemas.EventOut)
def update_event(event_id: str, payload: schemas.EventUpdate, request: Request, db: Session = Depends(get_db)) -> models.Event:
    require_admin(request)
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    _touch_site(db)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: str, request: Request, db: Session = Depends(get_db)) -> Response:
    require_admin(request)
    event = db.get(models.Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db.delete(event)
    _touch_site(db)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/posts", response_model=schemas.PostOut, status_code=status.HTTP_201_CREATED)
def create_post(payload: schemas.PostCreate, request: Request, db: Session = Depends(get_db)) -> models.Post:
    require_admin(request)
    post = models.Post(**payload.model_dump(exclude_none=True))
    db.add(post)
    _touch_site(db)
    db.commit()
    db.refresh(post)
    return post


@router.put("/posts/{post_id}", response_model=schemas.PostOut)
def update_post(post_id: str, payload: schemas.PostUpdate, request: Request, db: Session = Depends(get_db)) -> models.Post:
    require_admin(request)
    post = db.get(models.Post, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    _touch_site(db)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: str, request: Request, db: Session = Depends(get_db)) -> Response:
    require_admin(request)
    post = db.get(models.Post, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    db.delete(post)
    _touch_site(db)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/tickets", response_model=list[schemas.TicketOut])
def list_tickets(request: Request, db: Session = Depends(get_db)) -> list[models.TicketRequest]:
    require_admin(request)
    return list(db.scalars(select(models.TicketRequest).order_by(desc(models.TicketRequest.created_at))))


@router.patch("/tickets/{ticket_id}", response_model=schemas.TicketOut)
def update_ticket(
    ticket_id: str,
    payload: schemas.TicketUpdate,
    request: Request,
    db: Session = Depends(get_db),
) -> models.TicketRequest:
    require_admin(request)
    ticket = db.get(models.TicketRequest, ticket_id)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    ticket.status = payload.status
    _touch_site(db)
    db.commit()
    db.refresh(ticket)
    return ticket
