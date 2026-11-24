import { Pressable, View } from "react-native";

import { useTheme } from "../theme";
import { AppText } from "./AppText";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: "row",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radii.md,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radii.sm,
              backgroundColor: selected ? theme.colors.background : "transparent",
              borderWidth: selected ? 1 : 0,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <AppText
              variant="button"
              style={{ color: selected ? theme.colors.textPrimary : theme.colors.textMuted }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
