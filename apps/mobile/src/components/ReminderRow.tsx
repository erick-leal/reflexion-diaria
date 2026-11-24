import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Platform, Pressable, Switch, View } from "react-native";

import { useTheme } from "../theme";
import { AppText } from "./AppText";

interface ReminderRowProps {
  title: string;
  description: string;
  enabled: boolean;
  /** "HH:MM" */
  time: string;
  onToggle: (enabled: boolean) => void;
  onChangeTime: (time: string) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Picker IMPERATIVO (DateTimePickerAndroid.open): se abre al tocar la hora y
 * se cierra solo. En Versiculo, el <DateTimePicker> declarativo montado
 * quedaba "pegado" como dialogo nativo en Android; este es el fix de alla.
 */
function pickTime(current: string, onPicked: (time: string) => void) {
  const [hour, minute] = current.split(":").map(Number);
  const value = new Date();
  value.setHours(hour, minute, 0, 0);
  DateTimePickerAndroid.open({
    value,
    mode: "time",
    is24Hour: true,
    onChange: (event, date) => {
      if (event.type === "set" && date) onPicked(`${pad(date.getHours())}:${pad(date.getMinutes())}`);
    },
  });
}

export function ReminderRow({ title, description, enabled, time, onToggle, onChangeTime }: ReminderRowProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radii.md,
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="title" style={{ fontSize: 16 }}>
            {title}
          </AppText>
          <AppText variant="caption">{description}</AppText>
        </View>
        <Switch
          accessibilityLabel={title}
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
          thumbColor={theme.colors.background}
        />
      </View>

      {enabled ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Cambiar la hora: ${time}`}
          // iOS no esta en alcance todavia (Fase 11+): ahi este picker no existe.
          disabled={Platform.OS !== "android"}
          onPress={() => pickTime(time, onChangeTime)}
          style={({ pressed }) => ({
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <AppText>Hora</AppText>
          <AppText variant="title" style={{ color: theme.colors.accent }}>
            {time}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
