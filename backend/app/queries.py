from fastapi import HTTPException
from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.core.dates import today
from app.models import DailyReflection, Reflection


def visible_daily() -> Select[tuple[DailyReflection]]:
    """Punto de partida OBLIGATORIO de toda consulta publica de dias.

    Visible = publicado (revision humana) Y con fecha <= hoy. Lo segundo
    importa porque el cron publica con dias de anticipacion: sin ese filtro,
    pidiendo /daily-reflection/{id} se podria leer el contenido de manana.
    Favoritos, historial y diario tambien parten de aqui.
    """
    return (
        select(DailyReflection)
        .join(Reflection, DailyReflection.reflection_id == Reflection.id)
        .where(Reflection.status == "published", DailyReflection.date <= today())
    )


def get_visible_daily_or_404(db: Session, daily_reflection_id: int) -> DailyReflection:
    daily = db.scalars(visible_daily().where(DailyReflection.id == daily_reflection_id)).first()
    if daily is None:
        raise HTTPException(status_code=404, detail="Reflexión no encontrada")
    return daily
