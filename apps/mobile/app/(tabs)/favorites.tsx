import { FlatList, RefreshControl } from "react-native";

import { useFavorites } from "../../src/api/useFavorites";
import { AppText } from "../../src/components/AppText";
import { ReflectionListItem } from "../../src/components/ReflectionListItem";
import { Screen } from "../../src/components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../src/components/StateMessage";
import { useTheme } from "../../src/theme";

export default function FavoritesScreen() {
  const theme = useTheme();
  const { data, isPending, isError, refetch, isRefetching } = useFavorites();

  return (
    <Screen edges={["top"]}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => String(item.daily_reflection.id)}
        renderItem={({ item }) => <ReflectionListItem daily={item.daily_reflection} />}
        contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.lg, paddingTop: theme.spacing.xl }}
        ListHeaderComponent={
          <AppText variant="label" style={{ marginBottom: theme.spacing.md }}>
            Favoritos
          </AppText>
        }
        // Loading/error/vacio ocupan el lugar de la lista (donde ira la data).
        ListEmptyComponent={
          isPending ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState message="No pudimos cargar tus favoritos." onRetry={() => refetch()} />
          ) : (
            <EmptyState
              title="Aún no guardas ninguna"
              message="Toca el corazón en una reflexión para tenerla siempre a mano aquí."
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      />
    </Screen>
  );
}
