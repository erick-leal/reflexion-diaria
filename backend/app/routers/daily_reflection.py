from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dates import today
from app.database import get_db
from app.models import DailyReflection
from app.queries import get_visible_daily_or_404, visible_daily
from app.schemas import DailyReflectionOut

router = APIRouter()


@router.get("/daily-reflection", response_model=DailyReflectionOut)
def get_daily_reflection(db: Session = Depends(get_db)) -> DailyReflection:
    daily = db.scalars(visible_daily().where(DailyReflection.date == today())).first()
    if daily is None:
        raise HTTPException(status_code=404, detail="No hay reflexión programada para hoy")
    return daily


@router.get("/daily-reflection/{daily_reflection_id}", response_model=DailyReflectionOut)
def get_daily_reflection_by_id(
    daily_reflection_id: int, db: Session = Depends(get_db)
) -> DailyReflection:
    return get_visible_daily_or_404(db, daily_reflection_id)
