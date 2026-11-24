import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { useDailyReflection } from "../api/useDailyReflection";
import { useJournalEntry } from "../api/useJournal";
import { localISODate } from "../lib/dates";
import { rescheduleReminders } from "../lib/reminders";
import { useSettings } from "../lib/settings";

/**
 * Componente sin UI, montado una vez en el layout de pestanas. Mantiene los
 * recordatorios programados al dia: reprograma al abrir la app, al volver a
 * primer plano, al cambiar los ajustes y al marcar/desmarcar "Lo hice" hoy.
 */
export function ReminderSync() {
  const { settings } = useSettings();
  const { data: today } = useDailyReflection();
  const { data: entry } = useJournalEntryForToday(today?.id);
  const isToday = today?.date === localISODate();
  const actionDoneToday = Boolean(isToday && entry?.action_done);

  // Cambia cada vez que la app vuelve a primer plano -> fuerza reprogramar
  // (la ventana de noches avanza un dia y no se acaba nunca si se usa la app).
  const [foregroundTick, setForegroundTick] = useState(0);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setForegroundTick((t) => t + 1);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    rescheduleReminders(settings, actionDoneToday).catch(() => {
      // Si falla (ej. permiso revocado a mano), no se rompe la app.
    });
  }, [
    settings.morningEnabled,
    settings.morningTime,
    settings.nightEnabled,
    settings.nightTime,
    actionDoneToday,
    foregroundTick,
  ]);

  return null;
}

function useJournalEntryForToday(dailyId: number | undefined) {
  // Los hooks no pueden ser condicionales: se llama siempre, pero la query
  // queda desactivada (no hace request) hasta que hay una reflexion de hoy.
  return useJournalEntry(dailyId ?? -1, dailyId !== undefined);
}
