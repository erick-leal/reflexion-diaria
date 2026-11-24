from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, daily_reflection, favorites, history, journal

app = FastAPI(title="Reflexion Diaria API")

# El panel admin corre en el navegador (la app movil no aplica CORS).
# Origenes explicitos, nunca wildcard. Al desplegar el admin (Fase 9) se agrega
# su dominio de Railway aqui.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(daily_reflection.router)
app.include_router(favorites.router)
app.include_router(history.router)
app.include_router(journal.router)
app.include_router(admin.router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
