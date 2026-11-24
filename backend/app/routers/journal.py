import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.dates import month_bounds, today, yesterday
from app.database import get_db
from app.dependencies import get_current_user_id
from app.models import DailyReflection, JournalEntry
from app.queries import get_visible_daily_or_404, visible_daily
from app.schemas import JournalEntryOut, JournalEntryUpdate, JournalStatsOut

router = APIRouter(prefix="/journal", tags=["diario"])


def _visible_ids():
    return visible_daily().with_only_columns(DailyReflection.id)


def _find_entry(db: Session, user_id: uuid.UUID, daily_reflection_id: int) -> JournalEntry | None:
    return db.scalars(
        select(JournalEntry).where(
            JournalEntry.user_id == user_id,
            JournalEntry.daily_reflection_id == daily_reflection_id,
        )
    ).first()


@router.get("", response_model=list[JournalEntryOut])
def list_entries(
    user_id: uuid.UUID = Depends(get_current_user_id), db: Session = Depends(get_db)
) -> list[JournalEntry]:
    return list(
        db.scalars(
            select(JournalEntry)
            .join(DailyReflection, JournalEntry.daily_reflection_id == DailyReflection.id)
            .where(JournalEntry.user_id == user_id, JournalEntry.daily_reflection_id.in_(_visible_ids()))
            .order_by(DailyReflection.date.desc())
        )
    )


@router.get("/stats", response_model=JournalStatsOut)
def journal_stats(
    month: str | None = Query(default=None, description="YYYY-MM; por defecto el mes actual"),
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> JournalStatsOut:
    """Conteo del mes, sin rachas (decision de producto: reconocer sin castigar)."""
    try:
        first, last = month_bounds(month)
    except ValueError:
        raise HTTPException(status_code=422, detail="month debe tener el formato YYYY-MM")
    actions_done, notes = db.execute(
        select(
            func.count().filter(JournalEntry.action_done),
            func.count(JournalEntry.note),
        )
        .join(DailyReflection, JournalEntry.daily_reflection_id == DailyReflection.id)
        .where(
            JournalEntry.user_id == user_id,
            DailyReflection.date.between(first, last),
            JournalEntry.daily_reflection_id.in_(_visible_ids()),
        )
    ).one()
    return JournalStatsOut(month=first.strftime("%Y-%m"), actions_done=actions_done, notes=notes)


@router.get("/{daily_reflection_id}", response_model=JournalEntryOut | None)
def get_entry(
    daily_reflection_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> JournalEntry | None:
    """La entrada de un dia, o null si todavia no hay (no es un error)."""
    get_visible_daily_or_404(db, daily_reflection_id)
    return _find_entry(db, user_id, daily_reflection_id)


@router.put("/{daily_reflection_id}", response_model=JournalEntryOut | None)
def update_entry(
    daily_reflection_id: int,
    payload: JournalEntryUpdate,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> JournalEntry | None:
    """Crea o actualiza la nota y/o la accion hecha. Devuelve null si la entrada quedo vacia."""
    daily = get_visible_daily_or_404(db, daily_reflection_id)
    try:
        return _apply_update(db, user_id, daily, payload)
    except IntegrityError:
        # Doble toque: otra request creo la misma entrada entre el SELECT y el
        # INSERT. Se reintenta UNA vez, ya sobre la fila existente.
        db.rollback()
        return _apply_update(db, user_id, daily, payload)


def _apply_update(
    db: Session, user_id: uuid.UUID, daily: DailyReflection, payload: JournalEntryUpdate
) -> JournalEntry | None:
    fields = payload.model_fields_set
    entry = _find_entry(db, user_id, daily.id)
    current_done = entry.action_done if entry else False
    wants_done = payload.action_done if "action_done" in fields and payload.action_done is not None else current_done

    if wants_done != current_done and daily.date not in (today(), yesterday()):
        # Decision de producto: la accion solo se marca (o desmarca) hoy o ayer.
        raise HTTPException(status_code=422, detail="Solo puedes marcar la acción de hoy o de ayer")

    note = payload.note if "note" in fields else (entry.note if entry else None)

    if note is None and not wants_done:
        if entry is not None:
            db.delete(entry)
            db.commit()
        return None

    if entry is None:
        entry = JournalEntry(user_id=user_id, daily_reflection_id=daily.id)
        db.add(entry)
    if wants_done != current_done:
        entry.action_done_at = func.now() if wants_done else None
    entry.note = note
    entry.action_done = wants_done
    db.commit()
    db.refresh(entry)
    return entry
