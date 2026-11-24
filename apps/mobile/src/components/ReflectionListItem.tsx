import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { formatShortDate } from "../lib/dates";
import { useTheme } from "../theme";
import { AppText } from "./AppText";

/** Fila de listado (favoritos, diario): fecha + frase; abre el detalle del dia. */
export function ReflectionListItem({ daily }: { daily: DailyReflection }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/day/${daily.id}`)}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        <AppText variant="caption">{formatShortDate(daily.date)}</AppText>
        <AppText variant="title" numberOfLines={2}>
          {daily.reflection.quote}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}
