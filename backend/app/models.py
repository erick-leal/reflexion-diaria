from datetime import date, datetime

from sqlalchemy import CheckConstraint, Date, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.constants import REFLECTION_SOURCES, REFLECTION_STATUSES
from app.database import Base


def _in_list(column: str, values: tuple[str, ...]) -> str:
    return f"{column} IN ({', '.join(repr(v) for v in values)})"


class Reflection(Base):
    """Una pieza de contenido completa: frase + reflexion + accion del dia.

    Frase y reflexion viven en la misma fila a proposito: la frase es original
    y siempre se revisa junto con su reflexion. No hay columna de autor: el
    contenido nunca se atribuye a terceros (ver CLAUDE.md, copyright).
    """

    __tablename__ = "reflections"
    __table_args__ = (
        CheckConstraint(_in_list("status", REFLECTION_STATUSES), name="ck_reflections_status"),
        CheckConstraint(_in_list("source", REFLECTION_SOURCES), name="ck_reflections_source"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    quote: Mapped[str] = mapped_column(Text, unique=True)
    body: Mapped[str] = mapped_column(Text)
    action: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text, default="draft", server_default="draft")
    source: Mapped[str] = mapped_column(Text, default="human", server_default="human")
    reviewed_by: Mapped[str | None] = mapped_column(Text)
    mood_tags: Mapped[list[str]] = mapped_column(
        ARRAY(Text), nullable=False, server_default=text("'{}'"), default=list
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


class DailyReflection(Base):
    """Que reflexion se muestra en cada fecha (una por dia).

    reflection_id NO es unico: el cron puede reutilizar una reflexion ya
    publicada fuera de su cooldown cuando se agotan las nuevas.
    """

    __tablename__ = "daily_reflections"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[date] = mapped_column(Date, unique=True)
    reflection_id: Mapped[int] = mapped_column(ForeignKey("reflections.id"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    reflection: Mapped["Reflection"] = relationship()
