import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyReflection, Favorite } from "@reflexion-diaria/shared";

import { ApiError, apiGet } from "./client";
import { favoritesKey } from "./useFavorites";

/**
 * Un dia concreto (pantalla de detalle). Si ya esta en algun cache (favoritos,
 * el dia de hoy) se muestra al instante con ese dato y se revalida por detras:
 * sin spinner al abrir un favorito.
 */
export function useDailyReflectionById(id: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["daily-reflection", id],
    queryFn: () => apiGet<DailyReflection>(`/daily-reflection/${id}`),
    enabled: Number.isInteger(id),
    // 404 = el dia no existe o se despublico: reintentar no lo arregla.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 3,
    placeholderData: () => {
      const today = queryClient.getQueryData<DailyReflection | null>(["daily-reflection"]);
      if (today?.id === id) return today;
      return queryClient
        .getQueryData<Favorite[]>(favoritesKey)
        ?.find((f) => f.daily_reflection.id === id)?.daily_reflection;
    },
  });
}
