import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { useFavorites } from "../../src/api/useFavorites";
import { useHistory } from "../../src/api/useHistory";
import { useJournalList } from "../../src/api/useJournal";
import { AppText } from "../../src/components/AppText";
import { HistoryCalendar } from "../../src/components/HistoryCalendar";
import { ReflectionListItem } from "../../src/components/ReflectionListItem";
import { Screen } from "../../src/components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../src/components/StateMessage";
import { monthKey } from "../../src/lib/dates";
import { useTheme } from "../../src/theme";

function firstOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function HistoryScreen() {
  const theme = useTheme();
  const [month, setMonth] = useState(firstOfCurrentMonth);
  const history = useHistory(monthKey(month));
  const favorites = useFavorites();

  const journal = useJournalList();

  const favoriteIds = useMemo(
    () => new Set((favorites.data ?? []).map((f) => f.daily_reflection.id)),
    [favorites.data],
  );
  const doneIds = useMemo(
    () => new Set((journal.data ?? []).filter((e) => e.action_done).map((e) => e.daily_reflection.id)),
    [journal.data],
  );

  // Con keepPreviousData, mientras carga un mes nuevo `data` es la del mes
  // anterior: no se muestra como si fuera la del mes visible.
  const loadingMonth = history.isPending || history.isPlaceholderData;
  const days = loadingMonth ? [] : (history.data ?? []);
  // En la lista, lo mas reciente primero (el calendario ya da el orden temporal).
  const listDays = [...days].reverse();

  return (
    <Screen edges={["top"]}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: theme.spacing.lg,
          paddingTop: theme.spacing.xl,
          gap: theme.spacing.lg,
        }}
        refreshControl={
          <RefreshControl
            refreshing={history.isRefetching && !history.isPlaceholderData}
            onRefresh={() => {
              history.refetch();
              favorites.refetch();
              journal.refetch();
            }}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <AppText variant="label">Historial</AppText>

        <HistoryCalendar
          month={month}
          days={days}
          favoriteIds={favoriteIds}
          doneIds={doneIds}
          onChangeMonth={setMonth}
        />

        {/* Estados en el lugar de la lista del mes (donde ira la data), con
            alto minimo para que el calendario no salte al cambiar de estado. */}
        <View style={{ flex: 1, minHeight: 160 }}>
          {loadingMonth ? (
            <LoadingState />
          ) : history.isError ? (
            <ErrorState message="No pudimos cargar este mes." onRetry={() => history.refetch()} />
          ) : listDays.length === 0 ? (
            <EmptyState title="Sin reflexiones" message="Este mes no tiene reflexiones publicadas." />
          ) : (
            listDays.map((daily) => <ReflectionListItem key={daily.id} daily={daily} />)
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
