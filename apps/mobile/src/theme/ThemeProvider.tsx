import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { useSettings } from "../lib/settings";
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

// Preferencia de Ajustes (guardada en el telefono): "system" sigue al modo del
// sistema; "light"/"dark" lo fuerzan.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme() === "dark" ? "dark" : "light";
  const { theme: preference } = useSettings().settings;
  const scheme = preference === "system" ? systemScheme : preference;
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
