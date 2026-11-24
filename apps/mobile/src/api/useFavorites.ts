import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DailyReflection, Favorite } from "@reflexion-diaria/shared";

import { userDelete, userGet, userPut } from "./client";

export const favoritesKey = ["favorites"] as const;

export function useFavorites() {
  return useQuery({
    queryKey: favoritesKey,
    queryFn: () => userGet<Favorite[]>("/favorites"),
  });
}

/** Deriva del listado (ya en cache): no hace una request por cada corazon. */
export function useIsFavorite(dailyReflectionId: number): boolean {
  const { data } = useFavorites();
  return data?.some((f) => f.daily_reflection.id === dailyReflectionId) ?? false;
}

/**
 * Agrega/quita un favorito con actualizacion OPTIMISTA (patron de Versiculo):
 * el corazon cambia al instante en el cache; si el servidor falla, se vuelve
 * al estado anterior. El backend es idempotente (PUT/DELETE), asi que tocar
 * varias veces seguidas no deja datos inconsistentes.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ daily, isFavorite }: { daily: DailyReflection; isFavorite: boolean }) =>
      isFavorite ? userDelete(`/favorites/${daily.id}`) : userPut<void>(`/favorites/${daily.id}`),

    onMutate: async ({ daily, isFavorite }) => {
      // Que un refetch en vuelo no pise el cambio optimista.
      await queryClient.cancelQueries({ queryKey: favoritesKey });
      const previous = queryClient.getQueryData<Favorite[]>(favoritesKey);

      queryClient.setQueryData<Favorite[]>(favoritesKey, (current = []) =>
        isFavorite
          ? current.filter((f) => f.daily_reflection.id !== daily.id)
          : [
              // id negativo = provisional; el refetch de onSettled trae el real.
              { id: -daily.id, created_at: new Date().toISOString(), daily_reflection: daily },
              ...current,
            ],
      );
      return { previous };
    },

    onError: (_error, _vars, context) => {
      queryClient.setQueryData(favoritesKey, context?.previous);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: favoritesKey }),
  });
}
