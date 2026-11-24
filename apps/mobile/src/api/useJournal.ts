import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DailyReflection,
  JournalEntry,
  JournalEntryUpdate,
  JournalStats,
} from "@reflexion-diaria/shared";

import { userGet, userPut } from "./client";

// Todas las claves del diario cuelgan de ["journal"]: invalidar ese prefijo
// refresca entrada, lista y conteo de una vez.
const journalKeys = {
  all: ["journal"] as const,
  entry: (dailyId: number) => ["journal", "entry", dailyId] as const,
  list: ["journal", "list"] as const,
  stats: (month: string) => ["journal", "stats", month] as const,
};

/** Entrada de un dia; null si todavia no hay (no es un error). */
export function useJournalEntry(dailyId: number, enabled = true) {
  return useQuery({
    queryKey: journalKeys.entry(dailyId),
    queryFn: () => userGet<JournalEntry | null>(`/journal/${dailyId}`),
    enabled,
  });
}

export function useJournalList() {
  return useQuery({
    queryKey: journalKeys.list,
    queryFn: () => userGet<JournalEntry[]>("/journal"),
  });
}

export function useJournalStats(month: string) {
  return useQuery({
    queryKey: journalKeys.stats(month),
    queryFn: () => userGet<JournalStats>(`/journal/stats?month=${month}`),
  });
}

/** Aplica un cambio parcial a una entrada (o la crea), igual que lo hara el backend. */
function applyUpdate(
  current: JournalEntry | null | undefined,
  daily: DailyReflection,
  update: JournalEntryUpdate,
): JournalEntry | null {
  const note = "note" in update ? (update.note?.trim() || null) : (current?.note ?? null);
  const actionDone = update.action_done ?? current?.action_done ?? false;
  if (note === null && !actionDone) return null; // el backend borra la entrada vacia
  return {
    id: current?.id ?? -daily.id, // id negativo = provisional hasta el refetch
    note,
    action_done: actionDone,
    updated_at: new Date().toISOString(),
    daily_reflection: daily,
  };
}

/**
 * Guarda nota y/o "lo hice" con actualizacion OPTIMISTA (patron de Versiculo):
 * la UI cambia al instante y vuelve atras si el servidor rechaza (ej. 422 por
 * marcar una accion de hace mas de un dia). Quien llama debe cerrar su modo
 * edicion de inmediato, sin esperar a onSuccess (leccion de MyReflectionEditor).
 */
export function useUpdateJournal(daily: DailyReflection) {
  const queryClient = useQueryClient();
  const entryKey = journalKeys.entry(daily.id);

  return useMutation({
    mutationFn: (update: JournalEntryUpdate) =>
      userPut<JournalEntry | null>(`/journal/${daily.id}`, update),

    onMutate: async (update) => {
      await queryClient.cancelQueries({ queryKey: journalKeys.all });
      const previousEntry = queryClient.getQueryData<JournalEntry | null>(entryKey);
      const previousList = queryClient.getQueryData<JournalEntry[]>(journalKeys.list);

      const next = applyUpdate(previousEntry, daily, update);
      queryClient.setQueryData(entryKey, next);
      if (previousList) {
        const others = previousList.filter((e) => e.daily_reflection.id !== daily.id);
        queryClient.setQueryData<JournalEntry[]>(
          journalKeys.list,
          next
            ? [...others, next].sort((a, b) => b.daily_reflection.date.localeCompare(a.daily_reflection.date))
            : others,
        );
      }
      return { previousEntry, previousList };
    },

    onError: (_error, _update, context) => {
      queryClient.setQueryData(entryKey, context?.previousEntry);
      queryClient.setQueryData(journalKeys.list, context?.previousList);
    },

    onSuccess: (saved) => queryClient.setQueryData(entryKey, saved),

    // Lista y conteo del mes se reconcilian con el servidor.
    onSettled: () => queryClient.invalidateQueries({ queryKey: journalKeys.all }),
  });
}
