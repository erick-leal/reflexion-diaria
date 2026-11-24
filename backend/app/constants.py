# Flujo editorial. Solo "published" llega a la app; la IA solo puede dejar
# contenido en "ai_generated", y pasar a "reviewed" exige revision humana.
REFLECTION_STATUSES = ("draft", "ai_generated", "reviewed", "published")

# Quien escribio el borrador (no es una atribucion publica: toda frase es de la
# voz editorial de la app, nunca de un tercero).
REFLECTION_SOURCES = ("human", "ai")

# Estados de animo (1-2 por reflexion). Lista definida en la guia editorial
# (docs/guia-editorial.md, Fase 10). Son identificadores sin tildes; las
# etiquetas visibles estan en packages/shared (MOOD_TAG_LABELS). Si cambia,
# cambiar tambien packages/shared (MOOD_TAGS).
MOOD_TAGS = (
    "ansiedad",
    "desanimo",
    "agotamiento",
    "inseguridad",
    "enfoque",
    "constancia",
    "cambio",
    "relaciones",
    "gratitud",
    "calma",
    "autocompasion",
    "limites",
)
