import uuid

from fastapi import APIRouter, Depends, Response
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user_id
from app.models import DailyReflection, Favorite
from app.queries import get_visible_daily_or_404, visible_daily
from app.schemas import FavoriteOut

router = APIRouter(prefix="/favorites", tags=["favoritos"])


@router.get("", response_model=list[FavoriteOut])
def list_favorites(
    user_id: uuid.UUID = Depends(get_current_user_id), db: Session = Depends(get_db)
) -> list[Favorite]:
    # Solo dias que siguen visibles: si el equipo editorial despublica uno,
    # desaparece tambien de los favoritos.
    visible_ids = visible_daily().with_only_columns(DailyReflection.id)
    return list(
        db.scalars(
            select(Favorite)
            .where(Favorite.user_id == user_id, Favorite.daily_reflection_id.in_(visible_ids))
            .order_by(Favorite.created_at.desc())
        )
    )


# PUT/DELETE por daily_reflection_id (no por id de favorito) e idempotentes:
# la app puede alternar el corazon de forma optimista sin conocer el id.


@router.put("/{daily_reflection_id}", status_code=204)
def add_favorite(
    daily_reflection_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> Response:
    get_visible_daily_or_404(db, daily_reflection_id)
    db.execute(
        insert(Favorite)
        .values(user_id=user_id, daily_reflection_id=daily_reflection_id)
        .on_conflict_do_nothing(index_elements=[Favorite.user_id, Favorite.daily_reflection_id])
    )
    db.commit()
    return Response(status_code=204)


@router.delete("/{daily_reflection_id}", status_code=204)
def remove_favorite(
    daily_reflection_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> Response:
    db.execute(
        delete(Favorite).where(
            Favorite.user_id == user_id, Favorite.daily_reflection_id == daily_reflection_id
        )
    )
    db.commit()
    return Response(status_code=204)
