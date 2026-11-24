import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "../theme";
import { AppText } from "./AppText";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onPress, variant = "primary" }: ButtonProps) {
  const theme = useTheme();
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: theme.radii.sm,
          paddingHorizontal: theme.spacing.lg,
          backgroundColor: primary ? theme.colors.accent : "transparent",
          borderColor: primary ? theme.colors.accent : theme.colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <AppText variant="button" style={{ color: primary ? theme.colors.onAccent : theme.colors.textPrimary }}>
        {label}
      </AppText>
    </Pressable>
  );
}

// minHeight 44: area tactil minima recomendada (Apple HIG / Material).
const styles = StyleSheet.create({
  base: { borderWidth: 1, minHeight: 44, alignItems: "center", justifyContent: "center" },
});
