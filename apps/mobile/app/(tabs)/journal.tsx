import { useQueryClient } from "@tanstack/react-query";
import { FlatList, RefreshControl, View } from "react-native";

import { useJournalList, useJournalStats } from "../../src/api/useJournal";
import { AppText } from "../../src/components/AppText";
import { JournalListItem } from "../../src/components/JournalListItem";
import { Screen } from "../../src/components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../src/components/StateMessage";
import { monthKey } from "../../src/lib/dates";
import { useTheme } from "../../src/theme";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Conteo del mes, SIN rachas (decision de producto): reconoce lo hecho y no
 * castiga lo que falta. Con 0, el texto invita en vez de reprochar.
 */
function MonthSummary() {
  const theme = useTheme();
  const { data } = useJournalStats(monthKey(new Date()));
  if (!data) return null;

  return (
    <View
      style={{
        backgroundColor: theme.colors.actionBackground,
        borderRadius: theme.radii.md,
        padding: theme.spacing.md,
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.md,
      }}
    >
      <AppText variant="label" style={{ color: theme.colors.actionLabel }}>
        Este mes
      </AppText>
      <AppText style={{ color: theme.colors.actionText }}>
        {data.actions_done > 0
          ? `Hiciste la acción ${plural(data.actions_done, "día", "días")}${
              data.notes > 0 ? ` y escribiste ${plural(data.notes, "nota", "notas")}` : ""
            }.`
          : "Cuando hagas la acción de un día, márcala con «Lo hice» y la vas a ver contada aquí."}
      </AppText>
    </View>
  );
}

export default function JournalScreen() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch, isRefetching } = useJournalList();

  return (
    <Screen edges={["top"]}>
      <FlatList
        data={data ?? []}
        keyExtractor={(entry) => String(entry.daily_reflection.id)}
        renderItem={({ item }) => <JournalListItem entry={item} />}
        contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.lg, paddingTop: theme.spacing.xl }}
        ListHeaderComponent={
          <View>
            <AppText variant="label" style={{ marginBottom: theme.spacing.md }}>
              Diario
            </AppText>
            <MonthSummary />
          </View>
        }
        ListEmptyComponent={
          isPending ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState message="No pudimos cargar tu diario." onRetry={() => refetch()} />
          ) : (
            <EmptyState
              title="Tu diario está vacío"
              message="En Hoy, marca «Lo hice» o agrega una nota sobre cómo te fue con la acción del día."
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            // Prefijo ["journal"]: refresca lista Y conteo del mes juntos.
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ["journal"] })}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      />
    </Screen>
  );
}
