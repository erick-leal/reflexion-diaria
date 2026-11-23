# Flujo editorial. Solo "published" llega a la app; la IA solo puede dejar
# contenido en "ai_generated", y pasar a "reviewed" exige revision humana.
REFLECTION_STATUSES = ("draft", "ai_generated", "reviewed", "published")

# Quien escribio el borrador (no es una atribucion publica: toda frase es de la
# voz editorial de la app, nunca de un tercero).
REFLECTION_SOURCES = ("human", "ai")

# Estados de animo para el buscador. Lista provisional: se afina junto con la
# guia editorial (Fase 10). Tambien vive en packages/shared (MOOD_TAGS).
MOOD_TAGS = (
    "ansiedad",
    "desanimo",
    "agotamiento",
    "inseguridad",
    "enfoque",
    "disciplina",
    "cambio",
    "relaciones",
    "gratitud",
    "calma",
)
