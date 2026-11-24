import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { setupNotifications } from "../src/lib/reminders";
import { SettingsProvider, useSettings } from "../src/lib/settings";
import { fontAssets, ThemeProvider, useTheme } from "../src/theme";

// El splash se mantiene hasta que cargan las fuentes: sin esto, el primer
// frame se dibuja con la fuente del sistema y "salta" a Manrope.
SplashScreen.preventAutoHideAsync();
setupNotifications();

const queryClient = new QueryClient();

function ThemedStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === "dark" ? "light" : "dark"} />
      {/* contentStyle evita el flash blanco entre pantallas en modo oscuro. */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: { fontFamily: theme.fonts.bold, fontSize: 17 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        {/* Detalle de un dia: encabezado nativo con boton atras y titulo = fecha. */}
        <Stack.Screen name="day/[id]" options={{ headerShown: true, headerBackTitle: "Atrás" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}

function AppShell() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  // Se espera tambien a los ajustes: asi el primer frame ya usa el tema
  // elegido (sin parpadeo claro -> oscuro). Leer AsyncStorage toma milisegundos.
  const { loaded: settingsLoaded } = useSettings();
  const ready = (fontsLoaded || fontError) && settingsLoaded;

  useEffect(() => {
    // Si las fuentes fallan, seguimos con la del sistema: nunca dejar la app en el splash.
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

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
