import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import type { JournalEntry } from "@reflexion-diaria/shared";

import { formatShortDate } from "../lib/dates";
import { useTheme } from "../theme";
import { AppText } from "./AppText";

/** Fila del diario: fecha, si hiciste la accion, la frase y tu nota. Abre el detalle del dia. */
export function JournalListItem({ entry }: { entry: JournalEntry }) {
  const theme = useTheme();
  const daily = entry.daily_reflection;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/day/${daily.id}`)}
      style={({ pressed }) => ({
        gap: theme.spacing.xs,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
        <AppText variant="caption">{formatShortDate(daily.date)}</AppText>
        {entry.action_done ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="checkmark-circle" size={14} color={theme.colors.accent} />
            <AppText variant="caption" style={{ color: theme.colors.accent }}>
              Acción hecha
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText variant="title" numberOfLines={1}>
        {daily.reflection.quote}
      </AppText>
      {entry.note ? <AppText numberOfLines={2}>{entry.note}</AppText> : null}
    </Pressable>
  );
}
