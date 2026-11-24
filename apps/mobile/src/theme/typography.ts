import { Manrope_400Regular } from "@expo-google-fonts/manrope/400Regular";
import { Manrope_500Medium } from "@expo-google-fonts/manrope/500Medium";
import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";

// Una sola familia (Manrope, sans geometrica): directa y practica, como la voz
// editorial, y distinta del serif de Versiculo. Se importan solo los 3 pesos
// usados (subpaths), no el paquete entero: cada peso es un .ttf en el bundle.
export const fontAssets = { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold };

export const fontFamilies = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  bold: "Manrope_700Bold",
};

export const typeScale = {
  quote: { fontFamily: fontFamilies.bold, fontSize: 25, lineHeight: 33 },
  title: { fontFamily: fontFamilies.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 25 },
  label: { fontFamily: fontFamilies.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1 },
  caption: { fontFamily: fontFamilies.regular, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fontFamilies.medium, fontSize: 15, lineHeight: 20 },
};
