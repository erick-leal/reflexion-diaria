import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDailyReflection } from "../src/api/useDailyReflection";

// Fase 4: pantalla funcional con estilos minimos. El sistema de diseno
// (tipografia, paleta, modo oscuro de verdad) llega en la Fase 5.
export default function Home() {
  const { data, isPending, isError, refetch, isRefetching } = useDailyReflection();
  const colors = useColorScheme() === "dark" ? dark : light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <Text style={[styles.appName, { color: colors.muted }]}>Reflexión Diaria</Text>

        {/* El loading ocupa el lugar donde aparecera el contenido (leccion de Versiculo). */}
        {isPending ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.muted} />
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={[styles.message, { color: colors.text }]}>
              No pudimos cargar la reflexión de hoy. Revisa tu conexión.
            </Text>
            <Pressable onPress={() => refetch()} style={[styles.button, { borderColor: colors.muted }]}>
              <Text style={{ color: colors.text }}>Reintentar</Text>
            </Pressable>
          </View>
        ) : data === null ? (
          <View style={styles.center}>
            <Text style={[styles.message, { color: colors.text }]}>
              La reflexión de hoy todavía no está lista. Vuelve en un rato.
            </Text>
          </View>
        ) : (
          <View>
            <Text style={[styles.quote, { color: colors.text }]}>{data.reflection.quote}</Text>
            <Text style={[styles.body, { color: colors.text }]}>{data.reflection.body}</Text>
            <View style={[styles.actionBox, { backgroundColor: colors.card }]}>
              <Text style={[styles.actionLabel, { color: colors.muted }]}>Para hoy</Text>
              <Text style={[styles.action, { color: colors.text }]}>{data.reflection.action}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const light = { bg: "#FAFAF8", text: "#1C1C1A", muted: "#6B6B66", card: "#EFEEE9" };
const dark = { bg: "#141413", text: "#F1F0EC", muted: "#9C9B95", card: "#23231F" };

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flexGrow: 1, padding: 24 },
  appName: { fontSize: 14, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  message: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  button: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  quote: { fontSize: 26, fontWeight: "600", lineHeight: 34, marginBottom: 20 },
  body: { fontSize: 17, lineHeight: 26, marginBottom: 24 },
  actionBox: { borderRadius: 12, padding: 16 },
  actionLabel: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  action: { fontSize: 16, lineHeight: 24 },
});
