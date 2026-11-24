import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// Ajustes guardados SOLO en el telefono (decision de Erick, Fase 7): las
// notificaciones son locales y el servidor nunca usa estos datos. Ventajas:
// el tema se lee antes del primer frame (sin parpadeo) y funciona sin red.
// Se pierden al desinstalar, igual que la identidad anonima.

export type ThemePreference = "system" | "light" | "dark";

export interface Settings {
  theme: ThemePreference;
  morningEnabled: boolean;
  /** "HH:MM" en hora local del telefono. */
  morningTime: string;
  nightEnabled: boolean;
  nightTime: string;
  /** Ya se mostro la invitacion a activar recordatorios (al primer "Lo hice"). */
  reminderInviteSeen: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  morningEnabled: false, // opt-in: se activan solo cuando la persona lo pide
  morningTime: "07:30",
  nightEnabled: false,
  nightTime: "21:00",
  reminderInviteSeen: false,
};

// Versionada: si un dia cambia la forma, se migra o se descarta sin romper.
const STORAGE_KEY = "settings-v1";

interface SettingsContextValue {
  settings: Settings;
  /** true cuando ya se leyo AsyncStorage (el layout espera esto para quitar el splash). */
  loaded: boolean;
  update: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        // Merge con los defaults: un ajuste nuevo agregado en otra version
        // toma su valor por defecto en vez de quedar undefined.
        if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      })
      .catch(() => {
        // Storage ilegible: se sigue con los defaults, nunca se bloquea la app.
      })
      .finally(() => setLoaded(true));
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return <SettingsContext.Provider value={{ settings, loaded, update }}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings debe usarse dentro de SettingsProvider");
  return ctx;
}
