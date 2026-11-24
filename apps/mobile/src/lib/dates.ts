/**
 * "2026-11-24" -> Date LOCAL de ese dia. Ojo: new Date("2026-11-24") lo
 * interpreta como medianoche UTC, que en Colombia es el 23 a las 19:00 y
 * mostraria el dia anterior.
 */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** "2026-11-24" -> "martes 24 de noviembre" */
export function formatLongDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
}

/** Fecha local de hoy como "YYYY-MM-DD". */
export function localISODate(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * La accion solo se marca hoy o ayer (decision de producto). El backend es
 * quien decide (con la fecha de Bogota); esto solo evita ofrecer un boton
 * que el servidor va a rechazar.
 */
export function canMarkAction(iso: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return iso >= localISODate(yesterday) && iso <= localISODate();
}

/** Date -> "YYYY-MM" (formato del parametro month del backend). */
export function monthKey(date: Date): string {
  return localISODate(date).slice(0, 7);
}

/** Date (cualquier dia del mes) -> "Noviembre 2026" */
export function formatMonthYear(date: Date): string {
  return capitalize(date.toLocaleDateString("es", { month: "long", year: "numeric" }));
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "2026-11-24" -> "24 nov" */
export function formatShortDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("es", { day: "numeric", month: "short" }).replace(".", "");
}
