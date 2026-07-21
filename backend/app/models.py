import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


def new_id() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class SiteContent(Base):
    __tablename__ = "site_content"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    hero_eyebrow: Mapped[str] = mapped_column(String(255), default="")
    hero_title_line1: Mapped[str] = mapped_column(String(255), default="")
    hero_title_accent: Mapped[str] = mapped_column(String(255), default="")
    hero_title_line2: Mapped[str] = mapped_column(String(255), default="")
    hero_subtitle: Mapped[str] = mapped_column(Text, default="")
    about_kicker: Mapped[str] = mapped_column(String(255), default="")
    about_title_line1: Mapped[str] = mapped_column(String(255), default="")
    about_title_accent: Mapped[str] = mapped_column(String(255), default="")
    about_lead: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class Event(Base, TimestampMixin):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    title: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(100), default="")
    date: Mapped[str] = mapped_column(String(80), default="")
    time: Mapped[str] = mapped_column(String(80), default="")
    location: Mapped[str] = mapped_column(String(255), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    seats_label: Mapped[str] = mapped_column(String(100), default="")
    color: Mapped[str] = mapped_column(String(20), default="#2d2d2d")
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)
    ticket_enabled: Mapped[bool] = mapped_column(Boolean, default=False)


class Post(Base, TimestampMixin):
    __tablename__ = "posts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    title: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(100), default="")
    excerpt: Mapped[str] = mapped_column(Text, default="")
    body: Mapped[str] = mapped_column(Text, default="")
    image_url: Mapped[str] = mapped_column(String(500), default="")
    image_alt: Mapped[str] = mapped_column(String(255), default="")
    published_at: Mapped[str] = mapped_column(String(32), default="")
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)


class TicketRequest(Base, TimestampMixin):
    __tablename__ = "ticket_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    event_id: Mapped[str] = mapped_column(String(36), index=True)
    event_title: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(100), default="")
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    note: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(20), default="new", index=True)


class MediaAsset(Base, TimestampMixin):
    __tablename__ = "media_assets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    filename: Mapped[str] = mapped_column(String(255))
    content_type: Mapped[str] = mapped_column(String(100))
    path: Mapped[str] = mapped_column(String(500), unique=True)
    url: Mapped[str] = mapped_column(String(500))
    size: Mapped[int] = mapped_column(Integer)
