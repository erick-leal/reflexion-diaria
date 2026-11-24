// Tipos compartidos entre apps/mobile y apps/admin. Reflejan los schemas de
// backend/app/schemas.py: si cambia uno, cambiar el otro.

/** Estados editoriales. Nada llega a la app sin pasar por `reviewed`. */
export type ReflectionStatus = "draft" | "ai_generated" | "reviewed" | "published";

/** Estados de ánimo (docs/guia-editorial.md). Espejo de backend/app/constants.py. */
export const MOOD_TAGS = [
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
] as const;
export type MoodTag = (typeof MOOD_TAGS)[number];

/** Cómo se muestra cada etiqueta (los identificadores van sin tildes). */
export const MOOD_TAG_LABELS: Record<MoodTag, string> = {
  ansiedad: "Ansiedad",
  desanimo: "Desánimo",
  agotamiento: "Agotamiento",
  inseguridad: "Inseguridad",
  enfoque: "Enfoque",
  constancia: "Constancia",
  cambio: "Cambio",
  relaciones: "Relaciones",
  gratitud: "Gratitud",
  calma: "Calma",
  autocompasion: "Autocompasión",
  limites: "Límites",
};

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

// --- Fase 6: favoritos, historial y diario (requieren header X-Device-Id) ---

/** GET /favorites. Se agregan/quitan con PUT/DELETE /favorites/{daily_reflection_id} (idempotentes, 204). */
export interface Favorite {
  id: number;
  created_at: string;
  daily_reflection: DailyReflection;
}

/** GET /journal, GET/PUT /journal/{daily_reflection_id}. Una entrada por usuario y día. */
export interface JournalEntry {
  id: number;
  note: string | null;
  action_done: boolean;
  updated_at: string;
  daily_reflection: DailyReflection;
}

/**
 * Body de PUT /journal/{daily_reflection_id}: parcial, solo se tocan los campos enviados.
 * note vacía = borrar nota. action_done solo se puede cambiar hoy o ayer (si no, 422).
 * Si queda sin nota ni acción, la entrada se borra y la respuesta es null.
 */
export interface JournalEntryUpdate {
  note?: string | null;
  action_done?: boolean;
}

/** GET /journal/stats?month=YYYY-MM. Conteo del mes, sin rachas (decisión de producto). */
export interface JournalStats {
  month: string;
  actions_done: number;
  notes: number;
}

// --- Fase 9: panel admin (requieren Authorization: Bearer <ID token de Firebase>) ---
// Espejo de backend/app/admin_schemas.py.

export type ReflectionSource = "human" | "ai";

/** GET /admin/reflections. A diferencia de la API pública, incluye los campos internos. */
export interface AdminReflection {
  id: number;
  quote: string;
  body: string;
  action: string;
  status: ReflectionStatus;
  source: ReflectionSource;
  reviewed_by: string | null;
  mood_tags: MoodTag[];
  created_at: string;
  updated_at: string;
  /** Fechas en que está programada (YYYY-MM-DD). */
  scheduled_dates: string[];
}

/** POST /admin/reflections. No se crea directo en "published": publicar = programar una fecha. */
export interface AdminReflectionCreate {
  quote: string;
  body: string;
  action: string;
  status?: "draft" | "reviewed";
  mood_tags?: MoodTag[];
}

/** PUT /admin/reflections/{id} (parcial). */
export type AdminReflectionUpdate = Partial<Omit<AdminReflectionCreate, "status">> & {
  status?: "draft" | "ai_generated" | "reviewed";
};

/** GET /admin/reflections/stats */
export interface AdminStats {
  draft: number;
  ai_generated: number;
  reviewed: number;
  published: number;
  /** Días futuros ya programados (el colchón que mantiene el cron). */
  scheduled_ahead: number;
}

/** GET/POST /admin/daily-reflections */
export interface AdminDailyReflection {
  id: number;
  date: string;
  reflection: AdminReflection;
}
