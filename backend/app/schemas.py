from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator


class ReflectionOut(BaseModel):
    quote: str
    body: str
    action: str
    mood_tags: list[str]

    model_config = {"from_attributes": True}


class DailyReflectionOut(BaseModel):
    id: int
    date: date
    reflection: ReflectionOut

    model_config = {"from_attributes": True}


class FavoriteOut(BaseModel):
    id: int
    created_at: datetime
    daily_reflection: DailyReflectionOut

    model_config = {"from_attributes": True}


class JournalEntryOut(BaseModel):
    id: int
    note: str | None
    action_done: bool
    updated_at: datetime
    daily_reflection: DailyReflectionOut

    model_config = {"from_attributes": True}


class JournalEntryUpdate(BaseModel):
    """Actualizacion parcial: solo se tocan los campos enviados.

    note vacia o solo espacios = borrar la nota. Si la entrada queda sin nota y
    sin accion hecha, se elimina.
    """

    note: str | None = Field(default=None, max_length=2000)
    action_done: bool | None = None

    @field_validator("note")
    @classmethod
    def blank_note_is_none(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class JournalStatsOut(BaseModel):
    month: str
    actions_done: int
    notes: int
