from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.constants import MOOD_TAGS

Status = Literal["draft", "ai_generated", "reviewed", "published"]
Source = Literal["human", "ai"]


def _clean_tags(tags: list[str] | None) -> list[str] | None:
    if tags is None:
        return None
    unknown = set(tags) - set(MOOD_TAGS)
    if unknown:
        raise ValueError(f"mood_tags desconocidos: {sorted(unknown)}")
    return sorted(set(tags))


class AdminReflectionOut(BaseModel):
    """A diferencia de la API publica, el admin SI ve los campos internos."""

    id: int
    quote: str
    body: str
    action: str
    status: Status
    source: Source
    reviewed_by: str | None
    mood_tags: list[str]
    created_at: datetime
    updated_at: datetime
    # Fechas en las que esta programada (puede repetirse tras el cooldown).
    scheduled_dates: list[date] = []

    model_config = {"from_attributes": True}


class ReflectionCreate(BaseModel):
    quote: str = Field(min_length=1, max_length=300)
    body: str = Field(min_length=1, max_length=2000)
    action: str = Field(min_length=1, max_length=500)
    # El admin no crea directo en "published": publicar es programar una fecha.
    status: Literal["draft", "reviewed"] = "draft"
    mood_tags: list[str] = []

    @field_validator("mood_tags")
    @classmethod
    def valid_tags(cls, value: list[str]) -> list[str]:
        return _clean_tags(value) or []


class ReflectionUpdate(BaseModel):
    quote: str | None = Field(default=None, min_length=1, max_length=300)
    body: str | None = Field(default=None, min_length=1, max_length=2000)
    action: str | None = Field(default=None, min_length=1, max_length=500)
    # "published" no se asigna a mano: lo hace programar una fecha (o el cron).
    status: Literal["draft", "ai_generated", "reviewed"] | None = None
    mood_tags: list[str] | None = None

    @field_validator("mood_tags")
    @classmethod
    def valid_tags(cls, value: list[str] | None) -> list[str] | None:
        return _clean_tags(value)


class BulkIds(BaseModel):
    ids: list[int] = Field(min_length=1, max_length=500)


class ReflectionStats(BaseModel):
    draft: int = 0
    ai_generated: int = 0
    reviewed: int = 0
    published: int = 0
    # Dias futuros ya programados: el "colchon" que mantiene el cron.
    scheduled_ahead: int = 0


class AdminDailyReflectionOut(BaseModel):
    id: int
    date: date
    reflection: AdminReflectionOut

    model_config = {"from_attributes": True}


class DailyReflectionCreate(BaseModel):
    date: date
    reflection_id: int
