from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dates import today
from app.database import get_db
from app.models import DailyReflection, Reflection
from app.schemas import DailyReflectionOut

router = APIRouter()

# Toda consulta publica DEBE partir de aqui: el filtro status == "published"
# es la garantia de que nada sin revision humana llega a la app.
_published = (
    select(DailyReflection)
    .join(Reflection, DailyReflection.reflection_id == Reflection.id)
    .where(Reflection.status == "published")
)


@router.get("/daily-reflection", response_model=DailyReflectionOut)
def get_daily_reflection(db: Session = Depends(get_db)) -> DailyReflection:
    daily = db.scalars(_published.where(DailyReflection.date == today())).first()
    if daily is None:
        raise HTTPException(status_code=404, detail="No hay reflexión programada para hoy")
    return daily


@router.get("/daily-reflection/{daily_reflection_id}", response_model=DailyReflectionOut)
def get_daily_reflection_by_id(
    daily_reflection_id: int, db: Session = Depends(get_db)
) -> DailyReflection:
    daily = db.scalars(_published.where(DailyReflection.id == daily_reflection_id)).first()
    if daily is None:
        raise HTTPException(status_code=404, detail="Reflexión no encontrada")
    return daily
