import type { User } from "firebase/auth";
import { createContext, useContext } from "react";

export interface AuthContextValue {
  user: User | null;
  /** true hasta que Firebase dice si hay sesion guardada (evita "parpadear" al login). */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Separado de AuthProvider (auth.tsx): un archivo que exporta componentes y
// otras cosas a la vez rompe el fast refresh de Vite.
export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

/** Traduce los codigos de error de Firebase a algo entendible. */
export function signInErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found")
    return "Correo o contraseña incorrectos.";
  if (code === "auth/too-many-requests") return "Demasiados intentos. Espera unos minutos.";
  if (code === "auth/network-request-failed") return "Sin conexión. Revisa tu red.";
  return "No se pudo iniciar sesión.";
}
