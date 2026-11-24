import { RefreshControl, ScrollView, View } from "react-native";

import { useDailyReflection } from "../src/api/useDailyReflection";
import { AppText } from "../src/components/AppText";
import { ReflectionCard } from "../src/components/ReflectionCard";
import { Screen } from "../src/components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../src/components/StateMessage";
import { useTheme } from "../src/theme";

export default function Home() {
  const theme = useTheme();
  const { data, isPending, isError, refetch, isRefetching } = useDailyReflection();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.lg, gap: theme.spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <AppText variant="label">Reflexión Diaria</AppText>

        {isPending ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState
            message="No pudimos cargar la reflexión de hoy. Revisa tu conexión."
            onRetry={() => refetch()}
          />
        ) : data === null ? (
          <EmptyState
            title="Todavía no está lista"
            message="La reflexión de hoy aún no se publica. Vuelve en un rato."
          />
        ) : (
          // flex:1 + justifyContent center: una reflexion corta queda centrada en el
          // espacio libre; una larga ocupa mas que la pantalla y el ScrollView la
          // desplaza normalmente (flexGrow en el contentContainer).
          <View style={{ flex: 1, justifyContent: "center", paddingBottom: theme.spacing.xl }}>
            <ReflectionCard reflection={data.reflection} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
