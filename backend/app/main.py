from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, daily_reflection, favorites, history, journal, me, privacy

app = FastAPI(title="Reflexion Diaria API")

# El panel admin corre en el navegador (la app movil no aplica CORS).
# Origenes explicitos, nunca wildcard. Si se regenera el dominio del servicio
# "admin" en Railway, hay que actualizarlo aqui (y en los dominios autorizados
# de Firebase Auth).
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://admin-production-23567d79.up.railway.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(daily_reflection.router)
app.include_router(favorites.router)
app.include_router(history.router)
app.include_router(journal.router)
app.include_router(me.router)
app.include_router(admin.router)
app.include_router(privacy.router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
