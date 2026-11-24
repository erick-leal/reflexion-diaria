import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { Settings } from "./settings";

// Recordatorios LOCALES (sin servidor ni push). Dos tipos:
// - Manana: trigger DAILY repetido -> suena siempre a la hora elegida.
// - Noche "inteligente" (decision de Erick): pregunta si hiciste la accion y
//   NO suena si ya marcaste "Lo hice" hoy. Un trigger repetido no puede
//   saltarse un dia, asi que se programan fechas sueltas para los proximos
//   NIGHT_WINDOW_DAYS dias y se reprograma todo al abrir la app, al cambiar
//   ajustes y al marcar/desmarcar la accion.

const CHANNEL_ID = "recordatorios";
const NIGHT_WINDOW_DAYS = 14;

/** Llamar una vez al arrancar: como se muestran las notificaciones con la app abierta + canal Android. */
export function setupNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === "android") {
    // Android 8+: toda notificacion pertenece a un canal, que el usuario puede
    // silenciar por separado en los ajustes del sistema.
    Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Recordatorios diarios",
      importance: Notifications.AndroidImportance.DEFAULT,
    }).catch(() => {});
  }
}

/** Pide permiso solo si hace falta. Devuelve si quedo concedido. */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false; // el usuario dijo "no" y Android ya no deja preguntar
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function parseTime(hhmm: string): { hour: number; minute: number } {
  const [hour, minute] = hhmm.split(":").map(Number);
  return { hour, minute };
}

// Las reprogramaciones se encadenan en fila: si dos se cruzaran (cambiar la
// hora justo al volver a primer plano), el "cancelar todo" de una podria
// intercalarse con el "programar" de la otra y duplicar notificaciones.
let queue: Promise<void> = Promise.resolve();

/**
 * Cancela todo lo programado y lo vuelve a programar segun los ajustes.
 * Idempotente: se puede llamar cuantas veces sea, el resultado es el mismo.
 */
export function rescheduleReminders(settings: Settings, actionDoneToday: boolean): Promise<void> {
  queue = queue.catch(() => {}).then(() => doReschedule(settings, actionDoneToday));
  return queue;
}

async function doReschedule(settings: Settings, actionDoneToday: boolean): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!settings.morningEnabled && !settings.nightEnabled) return;

  const { granted } = await Notifications.getPermissionsAsync();
  if (!granted) return;

  if (settings.morningEnabled) {
    const { hour, minute } = parseTime(settings.morningTime);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tu paso de hoy ya está listo",
        body: "Abre la app para ver la frase y la acción del día.",
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: CHANNEL_ID },
    });
  }

  if (settings.nightEnabled) {
    const { hour, minute } = parseTime(settings.nightTime);
    const now = new Date();
    for (let offset = 0; offset < NIGHT_WINDOW_DAYS; offset++) {
      if (offset === 0 && actionDoneToday) continue; // ya cumplio: hoy no se le recuerda
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, minute);
      if (at <= now) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¿Pudiste dar tu paso de hoy?",
          body: "Si hiciste la acción, márcala con «Lo hice».",
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL_ID },
      });
    }
  }
}
