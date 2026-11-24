import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable } from "react-native";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { useTheme } from "../theme";
import { ShareSheet } from "./ShareSheet";

/** Icono de compartir que abre la hoja con la tarjeta. Va junto al corazon (Hoy y detalle). */
export function ShareButton({ daily }: { daily: DailyReflection }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Compartir como imagen"
        onPress={() => setOpen(true)}
        hitSlop={12}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 4 })}
      >
        <Ionicons name="share-social-outline" size={24} color={theme.colors.textMuted} />
      </Pressable>
      {/* Montada solo al abrir: no consulta el diario ni renderiza la tarjeta mientras esta cerrada. */}
      {open ? <ShareSheet daily={daily} visible onClose={() => setOpen(false)} /> : null}
    </>
  );
}
