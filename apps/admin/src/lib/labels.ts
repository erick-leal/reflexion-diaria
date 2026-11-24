import type { ReflectionStatus } from "@reflexion-diaria/shared";

export const STATUS_LABEL: Record<ReflectionStatus, string> = {
  draft: "Borrador",
  ai_generated: "Borrador IA",
  reviewed: "Revisada",
  published: "Publicada",
};

/** "2026-11-24" -> "mar 24 nov 2026" (sin corrimiento de zona horaria). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Fecha local de hoy como "YYYY-MM-DD". */
export function todayISO(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
