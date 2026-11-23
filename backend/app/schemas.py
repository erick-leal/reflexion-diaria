from datetime import date

from pydantic import BaseModel


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
