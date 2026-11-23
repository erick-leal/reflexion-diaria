// Tipos compartidos entre apps/mobile y apps/admin.
// Los tipos del dominio (Quote, Reflection, DailyQuote...) llegan en la Fase 2,
// junto con el modelo de datos del backend, para que ambos lados nazcan alineados.

/** Estados editoriales de una reflexión. Nada llega a la app sin pasar por `reviewed`. */
export type ReflectionStatus = "draft" | "ai_generated" | "reviewed" | "published";

export interface HealthResponse {
  status: "ok";
}
