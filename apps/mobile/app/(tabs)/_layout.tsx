import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../src/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

// Icono relleno si la pestaña esta activa, contorno si no (convencion iOS/Material).
function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} color={color} size={size} />;
  };
}

export default function TabsLayout() {
  const theme = useTheme();
  // Android con edge-to-edge (SDK 57): la app dibuja detras de la barra de
  // navegacion del sistema. insets.bottom es la altura de esos botones; se suma
  // a mano para controlar el aire extra y que la barra no quede "pegada".
  const insets = useSafeAreaInsets();
  const bottomGap = Math.max(insets.bottom, theme.spacing.sm) + theme.spacing.sm;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        // Patron de teclado de Versiculo: la barra no tapa formularios (diario).
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontFamily: theme.fonts.medium, fontSize: 11, marginTop: 2 },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 56 + bottomGap,
          paddingTop: theme.spacing.sm,
          paddingBottom: bottomGap,
        },
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Hoy", tabBarIcon: tabIcon("sunny", "sunny-outline") }} />
      <Tabs.Screen
        name="favorites"
        options={{ title: "Favoritos", tabBarIcon: tabIcon("heart", "heart-outline") }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "Historial", tabBarIcon: tabIcon("calendar", "calendar-outline") }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: "Diario", tabBarIcon: tabIcon("create", "create-outline") }}
      />
    </Tabs>
  );
}
