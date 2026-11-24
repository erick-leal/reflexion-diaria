import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, type User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "./authContext.ts";
import { auth } from "./firebase.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase recuerda la sesion en el navegador; esto avisa al cargar y al
  // iniciar/cerrar sesion. Es un sistema externo: aqui SI corresponde un efecto.
  useEffect(
    () =>
      onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      }),
    [],
  );

  const value: AuthContextValue = {
    user,
    loading,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signOut: () => firebaseSignOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
