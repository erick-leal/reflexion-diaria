import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { useTheme } from "../theme";

interface ScreenProps {
  children: ReactNode;
  edges?: Edge[];
}

// KeyboardAvoidingView desde ya: patron de Versiculo para que el teclado no
// tape formularios (el diario personal llega en la Fase 6).
export function Screen({ children, edges = ["top", "bottom"] }: ScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: theme.colors.background }]} edges={edges}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
