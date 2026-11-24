import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

// Identidad anonima: un UUID generado en el dispositivo la primera vez y
// guardado en AsyncStorage. Es lo que el backend usa como id de usuario
// (header X-Device-Id). Si se desinstala la app, se pierde (decision de
// producto: sin cuentas; ver CLAUDE.md).
const STORAGE_KEY = "device-id";

let pending: Promise<string> | null = null;

export function getDeviceId(): Promise<string> {
  // Se cachea la PROMESA, no el valor: si varias requests piden el id a la vez
  // en el primer arranque, todas esperan la misma y no se generan dos UUID
  // distintos (carrera que tenia la version de Versiculo).
  if (!pending) {
    pending = (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
      const id = randomUUID();
      await AsyncStorage.setItem(STORAGE_KEY, id);
      return id;
    })().catch((error) => {
      pending = null; // permitir reintentar si AsyncStorage fallo
      throw error;
    });
  }
  return pending;
}

/** Olvida la identidad actual ("Borrar mis datos"): la proxima request genera un UUID nuevo. */
export async function resetDeviceId(): Promise<void> {
  pending = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
}
