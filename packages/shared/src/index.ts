// Tipos compartidos entre apps/mobile y apps/admin. Reflejan los schemas de
// backend/app/schemas.py: si cambia uno, cambiar el otro.

/** Estados editoriales. Nada llega a la app sin pasar por `reviewed`. */
export type ReflectionStatus = "draft" | "ai_generated" | "reviewed" | "published";

/** Lista provisional (se afina con la guía editorial, Fase 10). Espejo de backend/app/constants.py. */
export const MOOD_TAGS = [
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
] as const;
export type MoodTag = (typeof MOOD_TAGS)[number];

/** Frase + reflexión + acción del día. Sin autor: todo es voz editorial propia. */
export interface Reflection {
  quote: string;
  body: string;
  action: string;
  mood_tags: MoodTag[];
}

/** Respuesta de GET /daily-reflection y GET /daily-reflection/{id}. */
export interface DailyReflection {
  id: number;
  /** Fecha ISO (YYYY-MM-DD), calculada en America/Bogota. */
  date: string;
  reflection: Reflection;
}

export interface HealthResponse {
  status: "ok";
}
