import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { formatMonthYear, localISODate } from "../lib/dates";
import { useTheme } from "../theme";
import { AppText } from "./AppText";

// Semana de lunes a domingo (convencion mas comun en Latam).
const WEEKDAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

interface HistoryCalendarProps {
  /** Primer dia del mes que se muestra. */
  month: Date;
  days: DailyReflection[];
  favoriteIds: Set<number>;
  /** Dias en los que el usuario marco "Lo hice". */
  doneIds: Set<number>;
  onChangeMonth: (month: Date) => void;
}

export function HistoryCalendar({ month, days, favoriteIds, doneIds, onChangeMonth }: HistoryCalendarProps) {
  const theme = useTheme();
  const todayKey = localISODate();

  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);

  const weeks = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    // getDay(): 0 = domingo. Se corre para que la semana empiece en lunes.
    const leadingBlanks = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

    const cells: (Date | null)[] = Array(leadingBlanks).fill(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, monthIndex, day));
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [month]);

  const now = new Date();
  // No hay contenido visible en el futuro: no se navega mas alla del mes actual.
  const isCurrentMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();

  const shiftMonth = (delta: number) =>
    onChangeMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <View>
      <View style={styles.header}>
        <Pressable
          onPress={() => shiftMonth(-1)}
          hitSlop={8}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Mes anterior"
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.textPrimary} />
        </Pressable>
        <AppText variant="title">{formatMonthYear(month)}</AppText>
        <Pressable
          onPress={() => shiftMonth(1)}
          disabled={isCurrentMonth}
          hitSlop={8}
          style={[styles.navButton, isCurrentMonth && { opacity: 0 }]}
          accessibilityRole="button"
          accessibilityLabel="Mes siguiente"
          accessibilityElementsHidden={isCurrentMonth}
        >
          <Ionicons name="chevron-forward" size={22} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.row}>
        {WEEKDAY_LABELS.map((label, index) => (
          <View key={index} style={styles.cell}>
            <AppText variant="caption" style={styles.center}>
              {label}
            </AppText>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.row}>
          {week.map((date, dayIndex) => {
            if (!date) return <View key={dayIndex} style={styles.cell} />;
            const key = localISODate(date);
            const entry = byDate.get(key);
            const isToday = key === todayKey;
            const isFavorite = entry ? favoriteIds.has(entry.id) : false;
            const isDone = entry ? doneIds.has(entry.id) : false;

            return (
              <View key={dayIndex} style={styles.cell}>
                <Pressable
                  disabled={!entry}
                  onPress={() => entry && router.push(`/day/${entry.id}`)}
                  accessibilityRole={entry ? "button" : undefined}
                  accessibilityLabel={
                    entry
                      ? `Ver la reflexión del ${date.getDate()}${isDone ? ", acción hecha" : ""}${isFavorite ? ", favorita" : ""}`
                      : undefined
                  }
                  style={({ pressed }) => [
                    styles.day,
                    entry && { backgroundColor: theme.colors.actionBackground },
                    // Accion hecha = circulo solido: los dias en que actuaste resaltan.
                    isDone && { backgroundColor: theme.colors.accent },
                    // Anillo de hoy en textPrimary: se distingue tambien sobre el circulo solido.
                    isToday && { borderWidth: 2, borderColor: theme.colors.textPrimary },
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <AppText
                    style={{
                      fontFamily: entry ? theme.fonts.bold : theme.fonts.regular,
                      color: isDone ? theme.colors.onAccent : entry ? theme.colors.actionText : theme.colors.textMuted,
                    }}
                  >
                    {date.getDate()}
                  </AppText>
                </Pressable>
                {/* Punto = favorito. Siempre se reserva el espacio para que las filas no salten. */}
                <View
                  style={[styles.dot, { backgroundColor: isFavorite ? theme.colors.accent : "transparent" }]}
                />
              </View>
            );
          })}
        </View>
      ))}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: theme.colors.accent }]} />
          <AppText variant="caption">Acción hecha</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
          <AppText variant="caption">Favorito</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 8 },
  navButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row" },
  cell: { flex: 1, alignItems: "center", paddingVertical: 4, gap: 3 },
  center: { textAlign: "center" },
  day: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  dot: { width: 5, height: 5, borderRadius: 3 },
  legend: { flexDirection: "row", justifyContent: "center", gap: 20, paddingTop: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendSwatch: { width: 12, height: 12, borderRadius: 6 },
});
