import Constants from "expo-constants";
import { useState } from "react";
import { Alert, Linking, ScrollView, View } from "react-native";

import { PRIVACY_URL } from "../../src/api/client";
import { useDeleteMyData } from "../../src/api/useDeleteMyData";
import { AppText } from "../../src/components/AppText";
import { Button } from "../../src/components/Button";
import { ReminderRow } from "../../src/components/ReminderRow";
import { openSystemSettings, useActivateReminders } from "../../src/lib/useActivateReminders";
import { Screen } from "../../src/components/Screen";
import { SegmentedControl } from "../../src/components/SegmentedControl";
import { useSettings, type ThemePreference } from "../../src/lib/settings";
import { useTheme } from "../../src/theme";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Automático" },
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <AppText variant="label">{title}</AppText>
      {children}
      {hint ? <AppText variant="caption">{hint}</AppText> : null}
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, update } = useSettings();
  const activate = useActivateReminders();
  const [permissionDenied, setPermissionDenied] = useState(false);
  const deleteData = useDeleteMyData();

  const toggle = async (which: "morning" | "night", on: boolean) => {
    if (!on) {
      update(which === "morning" ? { morningEnabled: false } : { nightEnabled: false });
      return;
    }
    const result = await activate({ [which]: true });
    setPermissionDenied(result === "denied");
  };

  const confirmDelete = () => {
    if (deleteData.isPending) return;
    Alert.alert(
      "¿Borrar tus datos?",
      "Se borrarán para siempre tus favoritos, las acciones que marcaste y las notas de tu diario. Tus ajustes se mantienen.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar", style: "destructive", onPress: () => deleteData.mutate() },
      ],
    );
  };

  return (
    <Screen edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.lg, paddingTop: theme.spacing.xl, gap: theme.spacing.xl }}
      >
        <AppText variant="title" style={{ fontSize: 22, lineHeight: 28 }}>
          Ajustes
        </AppText>

        <Section
          title="Apariencia"
          hint={settings.theme === "system" ? "Sigue el modo claro u oscuro de tu teléfono." : undefined}
        >
          <SegmentedControl
            accessibilityLabel="Apariencia"
            options={THEME_OPTIONS}
            value={settings.theme}
            onChange={(theme) => update({ theme })}
          />
        </Section>

        <Section title="Recordatorios">
          <ReminderRow
            title="Por la mañana"
            description="Te avisa que tu paso del día ya está listo."
            enabled={settings.morningEnabled}
            time={settings.morningTime}
            onToggle={(on) => toggle("morning", on)}
            onChangeTime={(morningTime) => update({ morningTime })}
          />
          <ReminderRow
            title="Por la noche"
            description="Te pregunta si hiciste la acción. No suena si ya marcaste «Lo hice»."
            enabled={settings.nightEnabled}
            time={settings.nightTime}
            onToggle={(on) => toggle("night", on)}
            onChangeTime={(nightTime) => update({ nightTime })}
          />
          {permissionDenied ? (
            <View style={{ gap: theme.spacing.sm }}>
              <AppText variant="caption" style={{ color: theme.colors.error }}>
                Las notificaciones están desactivadas para esta app. Actívalas en los ajustes del teléfono.
              </AppText>
              <Button label="Abrir ajustes del teléfono" variant="secondary" onPress={openSystemSettings} />
            </View>
          ) : null}
        </Section>

        <Section
          title="Tus datos"
          hint="No usamos cuentas: tus favoritos y tu diario van ligados a un código anónimo de este teléfono."
        >
          <Button
            label="Política de privacidad"
            variant="secondary"
            onPress={() => Linking.openURL(PRIVACY_URL)}
          />
          <Button
            label={deleteData.isPending ? "Borrando…" : "Borrar mis datos"}
            variant="secondary"
            onPress={confirmDelete}
          />
          {deleteData.isSuccess ? (
            <AppText variant="caption">Listo: se borraron tus favoritos y tu diario.</AppText>
          ) : null}
          {deleteData.isError ? (
            <AppText variant="caption" style={{ color: theme.colors.error }}>
              No se pudieron borrar. Revisa tu conexión e inténtalo de nuevo.
            </AppText>
          ) : null}
        </Section>

        <AppText variant="caption" style={{ textAlign: "center" }}>
          Un paso a la vez · versión {Constants.expoConfig?.version ?? "?"}
        </AppText>
      </ScrollView>
    </Screen>
  );
}
