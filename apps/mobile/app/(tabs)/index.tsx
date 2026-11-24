import { RefreshControl, ScrollView, View } from "react-native";

import { useDailyReflection } from "../../src/api/useDailyReflection";
import { AppText } from "../../src/components/AppText";
import { DayJournal } from "../../src/components/DayJournal";
import { FavoriteButton } from "../../src/components/FavoriteButton";
import { ReflectionCard } from "../../src/components/ReflectionCard";
import { ShareButton } from "../../src/components/ShareButton";
import { Screen } from "../../src/components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../src/components/StateMessage";
import { capitalize, formatLongDate, localISODate } from "../../src/lib/dates";
import { greetingFor } from "../../src/lib/greeting";
import { useTheme } from "../../src/theme";

export default function Home() {
  const theme = useTheme();
  const { data, isPending, isError, refetch, isRefetching } = useDailyReflection();

  return (
    // edges solo "top": abajo esta la barra de pestañas, que ya respeta el area segura.
    <Screen edges={["top"]}>
      <ScrollView
        // "handled": tocar Guardar con el teclado abierto guarda a la primera
        // (sin esto, el primer toque solo cierra el teclado).
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          padding: theme.spacing.lg,
          paddingTop: theme.spacing.xl,
          gap: theme.spacing.xl,
        }}
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
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ gap: theme.spacing.xs }}>
            <AppText variant="title" style={{ fontSize: 22, lineHeight: 28 }}>
              {greetingFor()}
            </AppText>
            {/* Fecha del contenido si ya cargo; si no, la del telefono (el encabezado no espera a la red). */}
            <AppText variant="caption">{capitalize(formatLongDate(data?.date ?? localISODate()))}</AppText>
          </View>
          {data ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.md }}>
              <ShareButton daily={data} />
              <FavoriteButton daily={data} />
            </View>
          ) : null}
        </View>

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
          <View style={{ flex: 1, justifyContent: "center", paddingBottom: theme.spacing.xl, gap: theme.spacing.lg }}>
            <ReflectionCard reflection={data.reflection} />
            <DayJournal daily={data} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
