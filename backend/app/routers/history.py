from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dates import month_bounds
from app.database import get_db
from app.models import DailyReflection
from app.queries import visible_daily
from app.schemas import DailyReflectionOut

router = APIRouter(tags=["historial"])


@router.get("/history", response_model=list[DailyReflectionOut])
def list_history(
    month: str | None = Query(default=None, description="YYYY-MM; por defecto el mes actual"),
    db: Session = Depends(get_db),
) -> list[DailyReflection]:
    """Dias visibles de un mes (para el calendario), en orden ascendente."""
    try:
        first, last = month_bounds(month)
    except ValueError:
        raise HTTPException(status_code=422, detail="month debe tener el formato YYYY-MM")
    return list(
        db.scalars(
            visible_daily()
            .where(DailyReflection.date.between(first, last))
            .order_by(DailyReflection.date)
        )
    )
