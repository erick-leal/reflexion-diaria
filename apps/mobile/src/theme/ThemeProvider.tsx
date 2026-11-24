import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { darkColors, lightColors, type ColorScheme } from "./colors";
import { radii, spacing } from "./spacing";
import { fontFamilies, typeScale } from "./typography";

export interface Theme {
  scheme: "light" | "dark";
  colors: ColorScheme;
  spacing: typeof spacing;
  radii: typeof radii;
  fonts: typeof fontFamilies;
  type: typeof typeScale;
}

const ThemeContext = createContext<Theme | null>(null);

// Por ahora sigue al sistema. La preferencia explicita Claro/Oscuro (guardada
// en el backend) llega con Ajustes en la Fase 7: solo hay que resolverla aqui.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const value: Theme = {
    scheme,
    colors: scheme === "dark" ? darkColors : lightColors,
    spacing,
    radii,
    fonts: fontFamilies,
    type: typeScale,
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
