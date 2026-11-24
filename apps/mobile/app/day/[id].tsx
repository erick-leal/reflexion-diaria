import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

import { ApiError } from "../../src/api/client";
import { useDailyReflectionById } from "../../src/api/useDailyReflectionById";
import { FavoriteButton } from "../../src/components/FavoriteButton";
import { ReflectionCard } from "../../src/components/ReflectionCard";
import { Screen } from "../../src/components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../src/components/StateMessage";
import { formatLongDate } from "../../src/lib/dates";
import { useTheme } from "../../src/theme";

/** Detalle de un dia (desde favoritos; el historial y el diario lo reusan en 6c/6d). */
export default function DayScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError, error, refetch } = useDailyReflectionById(Number(id));

  return (
    <Screen edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: data ? formatLongDate(data.date) : "",
          headerRight: data ? () => <FavoriteButton daily={data} /> : undefined,
        }}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.lg }}>
        {isPending ? (
          <LoadingState />
        ) : error instanceof ApiError && error.status === 404 ? (
          <EmptyState title="No disponible" message="Esta reflexión ya no está disponible." />
        ) : isError ? (
          <ErrorState message="No pudimos cargar esta reflexión." onRetry={() => refetch()} />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", paddingBottom: theme.spacing.xl }}>
            <ReflectionCard reflection={data.reflection} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
