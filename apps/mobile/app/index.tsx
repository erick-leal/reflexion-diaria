import { StyleSheet, Text, View } from "react-native";
import type { ReflectionStatus } from "@reflexion-diaria/shared";

// Pantalla placeholder de la Fase 1: solo prueba que Expo Router arranca y que
// el paquete compartido del monorepo se resuelve. El contenido real llega en la Fase 4.
const visibleStatus: ReflectionStatus = "published";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reflexión Diaria</Text>
      <Text style={styles.subtitle}>Esqueleto listo · solo se muestra contenido «{visibleStatus}»</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "600" },
  subtitle: { marginTop: 8, fontSize: 14, opacity: 0.6, textAlign: "center" },
});
