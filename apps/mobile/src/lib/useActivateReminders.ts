import { Linking } from "react-native";

import { ensureNotificationPermission } from "./reminders";
import { useSettings } from "./settings";

export type ActivateResult = "enabled" | "denied";

/**
 * Pide permiso y, si lo dan, activa recordatorios. Compartido entre Ajustes y
 * la invitacion del primer "Lo hice" (en Versiculo se duplico esta logica
 * entre el modal y el banner hasta que se extrajo a un hook: aqui nace asi).
 * La reprogramacion la hace ReminderSync al ver el cambio en los ajustes.
 */
export function useActivateReminders() {
  const { update } = useSettings();

  return async (which: { morning?: boolean; night?: boolean }): Promise<ActivateResult> => {
    const granted = await ensureNotificationPermission();
    if (!granted) return "denied";
    update({
      ...(which.morning ? { morningEnabled: true } : {}),
      ...(which.night ? { nightEnabled: true } : {}),
    });
    return "enabled";
  };
}

/** Si el permiso quedo negado para siempre, solo se puede cambiar desde los ajustes del sistema. */
export const openSystemSettings = () => Linking.openSettings();
