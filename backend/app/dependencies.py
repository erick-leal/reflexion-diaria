import uuid
from datetime import timedelta

from fastapi import Depends, Header, HTTPException
from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

# last_seen_at solo se refresca si quedo mas viejo que esto: evita escribir en
# la base en cada request (la app hace varias por pantalla).
LAST_SEEN_RESOLUTION = timedelta(hours=1)


def get_current_user_id(
    x_device_id: str = Header(..., description="UUID generado en el dispositivo"),
    db: Session = Depends(get_db),
) -> uuid.UUID:
    """Identidad anonima: crea el usuario la primera vez que aparece su X-Device-Id.

    Un solo INSERT ... ON CONFLICT atomico (no SELECT + INSERT): si la app
    dispara varias requests en paralelo en su primer arranque, ninguna falla
    por clave duplicada (bug latente de get_or_create_user en Versiculo).
    """
    try:
        user_id = uuid.UUID(x_device_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="X-Device-Id inválido")

    stmt = insert(User).values(id=user_id)
    stmt = stmt.on_conflict_do_update(
        index_elements=[User.id],
        set_={"last_seen_at": func.now()},
        where=User.last_seen_at < func.now() - LAST_SEEN_RESOLUTION,
    )
    db.execute(stmt)
    db.commit()
    return user_id
