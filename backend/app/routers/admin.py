from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.admin_auth import require_admin
from app.admin_schemas import (
    AdminDailyReflectionOut,
    AdminReflectionOut,
    BulkIds,
    DailyReflectionCreate,
    ReflectionCreate,
    ReflectionStats,
    ReflectionUpdate,
)
from app.core.dates import today
from app.database import get_db
from app.models import DailyReflection, Reflection

# require_admin en el router: NINGUN endpoint /admin queda sin proteger por olvido.
router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_admin)])

# Estados que implican revision humana: al llegar a ellos se registra quien reviso.
HUMAN_REVIEWED = {"reviewed", "published"}


def _get_reflection_or_404(db: Session, reflection_id: int) -> Reflection:
    reflection = db.get(Reflection, reflection_id)
    if reflection is None:
        raise HTTPException(status_code=404, detail="Reflexión no encontrada")
    return reflection


@router.get("/me")
def me(claims: dict = Depends(require_admin)) -> dict:
    return {"email": claims.get("email")}


# ---------------------------------------------------------------- reflexiones


@router.get("/reflections/stats", response_model=ReflectionStats)
def reflection_stats(db: Session = Depends(get_db)) -> ReflectionStats:
    counts = dict(db.execute(select(Reflection.status, func.count()).group_by(Reflection.status)).all())
    ahead = db.scalar(select(func.count()).select_from(DailyReflection).where(DailyReflection.date > today()))
    return ReflectionStats(**counts, scheduled_ahead=ahead or 0)


@router.get("/reflections", response_model=list[AdminReflectionOut])
def list_reflections(
    status: str | None = Query(default=None, description="Filtrar por estado"),
    q: str | None = Query(default=None, description="Buscar en frase, reflexión o acción"),
    db: Session = Depends(get_db),
) -> list[Reflection]:
    stmt = select(Reflection).options(selectinload(Reflection.daily_reflections))
    if status:
        stmt = stmt.where(Reflection.status == status)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(Reflection.quote.ilike(like) | Reflection.body.ilike(like) | Reflection.action.ilike(like))
    # Limite alto a proposito (en Versiculo un limite bajo escondia contenido).
    return list(db.scalars(stmt.order_by(Reflection.created_at.desc(), Reflection.id.desc()).limit(2000)))


@router.post("/reflections", response_model=AdminReflectionOut, status_code=201)
def create_reflection(
    payload: ReflectionCreate, claims: dict = Depends(require_admin), db: Session = Depends(get_db)
) -> Reflection:
    reflection = Reflection(
        **payload.model_dump(),
        source="human",
        reviewed_by=claims.get("email") if payload.status in HUMAN_REVIEWED else None,
    )
    db.add(reflection)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Ya existe una reflexión con esa frase")
    db.refresh(reflection)
    return reflection


@router.put("/reflections/{reflection_id}", response_model=AdminReflectionOut)
def update_reflection(
    reflection_id: int,
    payload: ReflectionUpdate,
    claims: dict = Depends(require_admin),
    db: Session = Depends(get_db),
) -> Reflection:
    reflection = _get_reflection_or_404(db, reflection_id)
    updates = payload.model_dump(exclude_unset=True, exclude_none=True)
    for field, value in updates.items():
        setattr(reflection, field, value)
    if updates.get("status") in HUMAN_REVIEWED:
        reflection.reviewed_by = claims.get("email")
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Ya existe una reflexión con esa frase")
    db.refresh(reflection)
    return reflection


@router.post("/reflections/bulk-review", response_model=list[AdminReflectionOut])
def bulk_review(
    payload: BulkIds, claims: dict = Depends(require_admin), db: Session = Depends(get_db)
) -> list[Reflection]:
    """Marca como revisadas (humano). NO publica ni asigna fecha: de eso se
    encarga el cron, que toma 'reviewed' y las programa una por dia."""
    reflections = list(db.scalars(select(Reflection).where(Reflection.id.in_(payload.ids))))
    missing = set(payload.ids) - {r.id for r in reflections}
    if missing:
        raise HTTPException(status_code=404, detail=f"IDs no encontrados: {sorted(missing)}")
    for reflection in reflections:
        if reflection.status != "published":  # no "despublica" lo ya publicado
            reflection.status = "reviewed"
            reflection.reviewed_by = claims.get("email")
    db.commit()
    return list(
        db.scalars(
            select(Reflection)
            .options(selectinload(Reflection.daily_reflections))
            .where(Reflection.id.in_(payload.ids))
        )
    )


@router.delete("/reflections/{reflection_id}", status_code=204)
def delete_reflection(reflection_id: int, db: Session = Depends(get_db)) -> Response:
    reflection = _get_reflection_or_404(db, reflection_id)
    if reflection.daily_reflections:
        raise HTTPException(
            status_code=409, detail="No se puede borrar: está programada en el calendario. Quita primero sus fechas."
        )
    db.delete(reflection)
    db.commit()
    return Response(status_code=204)


# ---------------------------------------------------------------- calendario


@router.get("/daily-reflections", response_model=list[AdminDailyReflectionOut])
def list_daily_reflections(
    date_from: date | None = Query(default=None, alias="from"),
    date_to: date | None = Query(default=None, alias="to"),
    db: Session = Depends(get_db),
) -> list[DailyReflection]:
    """Por defecto: 30 dias atras y 60 adelante (ventana util para revisar)."""
    start = date_from or today() - timedelta(days=30)
    end = date_to or today() + timedelta(days=60)
    return list(
        db.scalars(
            select(DailyReflection)
            .options(selectinload(DailyReflection.reflection).selectinload(Reflection.daily_reflections))
            .where(DailyReflection.date.between(start, end))
            .order_by(DailyReflection.date)
        )
    )


@router.post("/daily-reflections", response_model=AdminDailyReflectionOut, status_code=201)
def schedule_reflection(
    payload: DailyReflectionCreate, claims: dict = Depends(require_admin), db: Session = Depends(get_db)
) -> DailyReflection:
    """Programa una reflexion en una fecha. Solo acepta contenido ya revisado
    por un humano ('reviewed' o 'published'): la IA nunca llega al publico
    sin pasar por Erick. Al programarla, queda 'published'."""
    if payload.date < today():
        raise HTTPException(status_code=422, detail="No se puede programar una fecha pasada")
    reflection = _get_reflection_or_404(db, payload.reflection_id)
    if reflection.status not in HUMAN_REVIEWED:
        raise HTTPException(
            status_code=422,
            detail="Solo se pueden programar reflexiones revisadas. Márcala como revisada primero.",
        )
    daily = DailyReflection(date=payload.date, reflection_id=reflection.id)
    db.add(daily)
    if reflection.status != "published":
        reflection.status = "published"
        reflection.reviewed_by = reflection.reviewed_by or claims.get("email")
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Ya hay una reflexión programada para esa fecha")
    db.refresh(daily)
    return daily


@router.delete("/daily-reflections/{daily_id}", status_code=204)
def unschedule(daily_id: int, db: Session = Depends(get_db)) -> Response:
    daily = db.get(DailyReflection, daily_id)
    if daily is None:
        raise HTTPException(status_code=404, detail="Fecha no encontrada")
    if daily.date <= today():
        # Un dia pasado o de hoy ya lo vieron usuarios (favoritos, diario):
        # quitarlo romperia sus datos. Para ocultarlo, se despublica la reflexion.
        raise HTTPException(status_code=409, detail="Solo se pueden quitar fechas futuras")
    db.delete(daily)
    db.commit()
    return Response(status_code=204)
