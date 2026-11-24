import { useQuery } from "@tanstack/react-query";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { ApiError, apiGet } from "./client";

/**
 * Reflexión publicada de hoy. `data === null` significa que el backend respondió
 * 404 (no hay nada publicado para hoy): es un estado vacío, no un error, así
 * que no se reintenta. Los errores reales (red, 5xx) sí se reintentan.
 */
export function useDailyReflection() {
  return useQuery({
    queryKey: ["daily-reflection"],
    queryFn: async (): Promise<DailyReflection | null> => {
      try {
        return await apiGet<DailyReflection>("/daily-reflection");
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
  });
}
