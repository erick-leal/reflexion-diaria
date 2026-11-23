from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
