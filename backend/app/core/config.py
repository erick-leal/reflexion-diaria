from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    database_url: str
    # Panel admin (Fase 9). Opcionales A PROPOSITO: si faltan, solo los
    # endpoints /admin responden 503; la API publica sigue funcionando (en
    # Versiculo eran obligatorias y una variable olvidada tumbaba todo).
    firebase_project_id: str | None = None  # no es secreto
    admin_email: str | None = None

    @field_validator("database_url")
    @classmethod
    def use_psycopg_driver(cls, value: str) -> str:
        # Railway entrega URLs "postgres://" o "postgresql://"; SQLAlchemy
        # necesita el driver explicito para usar psycopg3.
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+psycopg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+psycopg://", 1)
        return value


settings = Settings()
