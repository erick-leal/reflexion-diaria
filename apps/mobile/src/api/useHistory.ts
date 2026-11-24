import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { apiGet } from "./client";

/**
 * Dias visibles de un mes ("YYYY-MM"), en orden ascendente. Una request por
 * mes, no todo el historial: escala aunque haya anos de contenido.
 * keepPreviousData: al cambiar de mes se sigue mostrando el anterior hasta
 * que llega el nuevo (sin parpadeo a pantalla vacia).
 */
export function useHistory(month: string) {
  return useQuery({
    queryKey: ["history", month],
    queryFn: () => apiGet<DailyReflection[]>(`/history?month=${month}`),
    placeholderData: keepPreviousData,
  });
}
