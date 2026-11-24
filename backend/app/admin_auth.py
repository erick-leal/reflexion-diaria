"""Autenticacion del panel admin con Firebase Auth, SIN el SDK firebase-admin.

firebase-admin arrastra google-cloud-* y grpcio; en Versiculo ese peso agoto
la memoria del contenedor en Railway (OOM silencioso). Verificar un ID token
solo requiere la firma RS256 contra las claves publicas de Google y el
project_id (que no es secreto). PyJWKClient descarga esas claves (JWKS) y las
cachea; Google las rota periodicamente y el cliente se actualiza solo.
"""

from functools import lru_cache

import jwt
from fastapi import Header, HTTPException

from app.core.config import settings

JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"


@lru_cache
def _jwks_client() -> jwt.PyJWKClient:
    return jwt.PyJWKClient(JWKS_URL, cache_keys=True, lifespan=3600, timeout=5)


def verify_firebase_token(token: str, project_id: str) -> dict:
    signing_key = _jwks_client().get_signing_key_from_jwt(token)
    return jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience=project_id,
        issuer=f"https://securetoken.google.com/{project_id}",
        options={"require": ["exp", "iat", "aud", "iss", "sub"]},
    )


def require_admin(authorization: str | None = Header(default=None)) -> dict:
    """Dependencia de todos los endpoints /admin. Devuelve los claims del token."""
    if not settings.firebase_project_id or not settings.admin_email:
        raise HTTPException(status_code=503, detail="Panel admin no configurado en el servidor")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Falta el token de administrador")

    try:
        claims = verify_firebase_token(authorization.removeprefix("Bearer "), settings.firebase_project_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    # Un token valido solo prueba que es una cuenta de ESTE proyecto Firebase,
    # no que sea el admin: la unica cuenta autorizada se valida aqui. (Ademas,
    # el registro publico esta deshabilitado en la consola de Firebase.)
    if (claims.get("email") or "").lower() != settings.admin_email.lower():
        raise HTTPException(status_code=403, detail="No autorizado")
    return claims
