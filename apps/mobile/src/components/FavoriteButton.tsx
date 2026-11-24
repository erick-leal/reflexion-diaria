import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { useIsFavorite, useToggleFavorite } from "../api/useFavorites";
import { useTheme } from "../theme";

export function FavoriteButton({ daily }: { daily: DailyReflection }) {
  const theme = useTheme();
  const isFavorite = useIsFavorite(daily.id);
  const toggle = useToggleFavorite();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      accessibilityState={{ selected: isFavorite }}
      onPress={() => toggle.mutate({ daily, isFavorite })}
      hitSlop={12}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={26}
        color={isFavorite ? theme.colors.accent : theme.colors.textMuted}
      />
    </Pressable>
  );
}
