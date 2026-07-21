from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, field_validator

PublishStatus = Literal["draft", "published"]
TicketStatus = Literal["new", "confirmed", "cancelled", "done"]


def to_camel(value: str) -> str:
    parts = value.split("_")
    return parts[0] + "".join(part.capitalize() for part in parts[1:])


class ApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class OrmApiModel(ApiModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class SiteContentBase(ApiModel):
    hero_eyebrow: str = ""
    hero_title_line1: str = ""
    hero_title_accent: str = ""
    hero_title_line2: str = ""
    hero_subtitle: str = ""
    about_kicker: str = ""
    about_title_line1: str = ""
    about_title_accent: str = ""
    about_lead: str = ""


class SiteContentIn(SiteContentBase):
    pass


class SiteContentOut(SiteContentBase, OrmApiModel):
    id: int
    updated_at: datetime


class EventBase(ApiModel):
    title: str
    category: str = ""
    date: str = ""
    time: str = ""
    location: str = ""
    description: str = ""
    seats_label: str = ""
    color: str = "#2d2d2d"
    status: PublishStatus = "draft"
    ticket_enabled: bool = False

    @field_validator("title")
    @classmethod
    def title_required(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title is required")
        return value


class EventCreate(EventBase):
    id: str | None = None


class EventUpdate(ApiModel):
    title: str | None = None
    category: str | None = None
    date: str | None = None
    time: str | None = None
    location: str | None = None
    description: str | None = None
    seats_label: str | None = None
    color: str | None = None
    status: PublishStatus | None = None
    ticket_enabled: bool | None = None


class EventOut(EventBase, OrmApiModel):
    id: str
    created_at: datetime
    updated_at: datetime


class PostBase(ApiModel):
    title: str
    slug: str
    category: str = ""
    excerpt: str = ""
    body: str = ""
    image_url: str = ""
    image_alt: str = ""
    published_at: str = ""
    status: PublishStatus = "draft"

    @field_validator("title", "slug")
    @classmethod
    def required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("field is required")
        return value


class PostCreate(PostBase):
    id: str | None = None


class PostUpdate(ApiModel):
    title: str | None = None
    slug: str | None = None
    category: str | None = None
    excerpt: str | None = None
    body: str | None = None
    image_url: str | None = None
    image_alt: str | None = None
    published_at: str | None = None
    status: PublishStatus | None = None


class PostOut(PostBase, OrmApiModel):
    id: str
    created_at: datetime
    updated_at: datetime


class TicketCreate(ApiModel):
    event_id: str
    name: str
    email: str
    phone: str = ""
    quantity: int = 1
    note: str = ""

    @field_validator("name", "email")
    @classmethod
    def required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("field is required")
        return value

    @field_validator("quantity")
    @classmethod
    def quantity_range(cls, value: int) -> int:
        if value < 1 or value > 20:
            raise ValueError("quantity must be between 1 and 20")
        return value


class TicketUpdate(ApiModel):
    status: TicketStatus


class TicketOut(OrmApiModel):
    id: str
    event_id: str
    event_title: str
    name: str
    email: str
    phone: str
    quantity: int
    note: str
    status: TicketStatus
    created_at: datetime
    updated_at: datetime


class MediaAssetOut(OrmApiModel):
    id: str
    filename: str
    content_type: str
    path: str
    url: str
    size: int
    created_at: datetime
    updated_at: datetime


class CmsSnapshot(ApiModel):
    site: SiteContentIn
    events: list[EventCreate]
    posts: list[PostCreate]
    tickets: list[TicketOut] = []


class CmsSnapshotOut(ApiModel):
    site: SiteContentOut
    events: list[EventOut]
    posts: list[PostOut]
    tickets: list[TicketOut]
    updated_at: datetime


class LoginRequest(ApiModel):
    password: str


class TokenResponse(ApiModel):
    access_token: str
    token_type: str = "bearer"
