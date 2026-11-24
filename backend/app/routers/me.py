import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, Response
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

router = APIRouter(prefix="/me", tags=["usuario"])


@router.delete("", status_code=204)
def delete_my_data(
    x_device_id: str = Header(..., description="UUID generado en el dispositivo"),
    db: Session = Depends(get_db),
) -> Response:
    """Borra el usuario anonimo y, por ON DELETE CASCADE, sus favoritos y su diario.

    No usa get_current_user_id: esa dependencia CREA el usuario si no existe.
    Idempotente: si el usuario ya no existe, igual responde 204. La app genera
    un UUID nuevo despues de llamar a este endpoint.
    """
    try:
        user_id = uuid.UUID(x_device_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="X-Device-Id inválido")

    db.execute(delete(User).where(User.id == user_id))
    db.commit()
    return Response(status_code=204)
