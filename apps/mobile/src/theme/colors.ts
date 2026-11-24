// Direccion visual "Claridad" (elegida por Erick en la Fase 5): fresca y
// practica, verde profundo como acento. El acento se usa en la caja "Para hoy",
// botones e iconos activos; nunca como color de texto de cuerpo largo.
// Todos los pares texto/fondo cumplen WCAG AA (verificado en la Fase 5).

export const lightColors = {
  background: "#F6F8F6",
  surface: "#ECF1EE",
  border: "#DCE3DF",
  textPrimary: "#15201C",
  textSecondary: "#3E4B46",
  textMuted: "#5F6E68",
  accent: "#1F6B52",
  onAccent: "#FFFFFF",
  actionBackground: "#DDEFE6",
  actionLabel: "#1F6B52",
  actionText: "#0E3D2E",
  error: "#B3261E",
};

export const darkColors: ColorScheme = {
  background: "#0F1513",
  surface: "#18201D",
  border: "#26312D",
  textPrimary: "#E8EEEB",
  textSecondary: "#B7C4BE",
  textMuted: "#8FA19A",
  accent: "#5CC49A",
  onAccent: "#06281C",
  actionBackground: "#16342A",
  actionLabel: "#6FD0A6",
  actionText: "#D3EFE2",
  error: "#FF8A80",
};

export type ColorScheme = typeof lightColors;
