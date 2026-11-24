import { View } from "react-native";
import type { Reflection } from "@reflexion-diaria/shared";

import { useTheme } from "../theme";
import { AppText } from "./AppText";

/** Frase + reflexion + caja "Para hoy". Reutilizable en Inicio, historial y favoritos. */
export function ReflectionCard({ reflection }: { reflection: Reflection }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.lg }}>
      <AppText variant="quote">{reflection.quote}</AppText>
      <AppText>{reflection.body}</AppText>
      <View
        style={{
          backgroundColor: theme.colors.actionBackground,
          borderRadius: theme.radii.md,
          padding: theme.spacing.md,
          gap: theme.spacing.xs,
        }}
      >
        <AppText variant="label" style={{ color: theme.colors.actionLabel }}>
          Para hoy
        </AppText>
        <AppText style={{ color: theme.colors.actionText }}>{reflection.action}</AppText>
      </View>
    </View>
  );
}
