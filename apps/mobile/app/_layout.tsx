import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { fontAssets, ThemeProvider, useTheme } from "../src/theme";

// El splash se mantiene hasta que cargan las fuentes: sin esto, el primer
// frame se dibuja con la fuente del sistema y "salta" a Manrope.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function ThemedStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === "dark" ? "light" : "dark"} />
      {/* contentStyle evita el flash blanco entre pantallas en modo oscuro. */}
      <Stack
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}
      />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    // Si las fuentes fallan, seguimos con la del sistema: nunca dejar la app en el splash.
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedStack />
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
