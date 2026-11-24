/** Saludo segun la hora LOCAL del telefono (no la de Bogota: es un saludo, no el corte del dia). */
export function greetingFor(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}
