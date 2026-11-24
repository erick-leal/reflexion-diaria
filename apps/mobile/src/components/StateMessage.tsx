import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useTheme } from "../theme";
import { AppText } from "./AppText";
import { Button } from "./Button";

// Los tres estados ocupan el mismo espacio flexible que ocupara el contenido:
// "el loading aparece donde en realidad va a aparecer la data" (leccion de Versiculo).

export function LoadingState() {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.center, { gap: theme.spacing.md }]}>
      <AppText style={styles.centeredText}>{message}</AppText>
      {onRetry ? <Button label="Reintentar" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.center, { gap: theme.spacing.sm }]}>
      <AppText variant="title" style={styles.centeredText}>
        {title}
      </AppText>
      <AppText style={styles.centeredText}>{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  centeredText: { textAlign: "center" },
});
