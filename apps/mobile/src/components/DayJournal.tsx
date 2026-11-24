import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { useJournalEntry, useUpdateJournal } from "../api/useJournal";
import { canMarkAction } from "../lib/dates";
import { useSettings } from "../lib/settings";
import { useActivateReminders } from "../lib/useActivateReminders";
import { useTheme } from "../theme";
import { AppText } from "./AppText";
import { Button } from "./Button";

const NOTE_MAX = 2000;

/** "Lo hice" + nota personal de un dia. Va debajo de la ReflectionCard (Hoy y detalle). */
export function DayJournal({ daily }: { daily: DailyReflection }) {
  const theme = useTheme();
  const { data: entry, isPending } = useJournalEntry(daily.id);
  const update = useUpdateJournal(daily);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  // Invitacion a recordatorios (decision de Erick): en el momento de mas
  // motivacion, justo al marcar "Lo hice" por primera vez. Una sola vez.
  const { settings, update: updateSettings } = useSettings();
  const activateReminders = useActivateReminders();
  const [justMarked, setJustMarked] = useState(false);
  const [inviteDenied, setInviteDenied] = useState(false);
  const showInvite =
    justMarked && !settings.reminderInviteSeen && !settings.morningEnabled && !settings.nightEnabled;

  const actionDone = entry?.action_done ?? false;
  const markable = canMarkAction(daily.date);

  // El loading aparece donde ira el bloque (leccion de Versiculo): sin pop-in.
  if (isPending) {
    return (
      <View style={{ minHeight: 96, justifyContent: "center" }}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  const startEditing = () => {
    setDraft(entry?.note ?? "");
    setEditing(true);
  };

  const saveNote = (note: string) => {
    update.mutate({ note });
    // Se cierra YA, confiando en el update optimista; esperar a onSuccess
    // reintroduce el lag visual (bug real de MyReflectionEditor en Versiculo).
    setEditing(false);
  };

  return (
    <View style={{ gap: theme.spacing.md }}>
      {markable ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: actionDone }}
          onPress={() => {
            update.mutate({ action_done: !actionDone });
            if (!actionDone) setJustMarked(true);
          }}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.sm,
            minHeight: 48,
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.accent,
            backgroundColor: actionDone ? theme.colors.accent : "transparent",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons
            name={actionDone ? "checkmark-circle" : "ellipse-outline"}
            size={22}
            color={actionDone ? theme.colors.onAccent : theme.colors.accent}
          />
          <AppText variant="button" style={{ color: actionDone ? theme.colors.onAccent : theme.colors.accent }}>
            {actionDone ? "¡Lo hiciste!" : "Lo hice"}
          </AppText>
        </Pressable>
      ) : actionDone ? (
        // Dias viejos: solo lectura (ya no se puede cambiar).
        <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm }}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.accent} />
          <AppText style={{ color: theme.colors.accent }}>Hiciste la acción de este día</AppText>
        </View>
      ) : null}

      {showInvite || inviteDenied ? (
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.md,
            padding: theme.spacing.md,
            gap: theme.spacing.sm,
          }}
        >
          {inviteDenied ? (
            <AppText>
              Sin permiso de notificaciones no podemos recordártelo. Si cambias de opinión, actívalas en Ajustes.
            </AppText>
          ) : (
            <>
              <AppText variant="title" style={{ fontSize: 16 }}>
                ¿Te recordamos mañana tu paso del día?
              </AppText>
              <AppText>
                Un aviso por la mañana y otro por la noche, que no suena si ya hiciste la acción. Puedes cambiarlo en
                Ajustes.
              </AppText>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: theme.spacing.sm }}>
                <Button
                  label="Ahora no"
                  variant="secondary"
                  onPress={() => updateSettings({ reminderInviteSeen: true })}
                />
                <Button
                  label="Sí, recuérdame"
                  onPress={async () => {
                    updateSettings({ reminderInviteSeen: true });
                    const result = await activateReminders({ morning: true, night: true });
                    setInviteDenied(result === "denied");
                  }}
                />
              </View>
            </>
          )}
        </View>
      ) : null}

      {update.isError ? (
        <AppText variant="caption" style={{ color: theme.colors.error }}>
          No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.
        </AppText>
      ) : null}

      {editing ? (
        <View style={{ gap: theme.spacing.sm }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            autoFocus
            multiline
            maxLength={NOTE_MAX}
            placeholder="¿Cómo te fue con la acción de hoy?"
            placeholderTextColor={theme.colors.textMuted}
            style={{
              ...theme.type.body,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRadius: theme.radii.md,
              padding: theme.spacing.md,
              minHeight: 96,
              // Tope de alto: el input no crece sin limite y empuja los botones
              // fuera de la pantalla (patron de teclado de Versiculo).
              maxHeight: 200,
              textAlignVertical: "top",
            }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: theme.spacing.sm }}>
            <Button label="Cancelar" variant="secondary" onPress={() => setEditing(false)} />
            <Button label="Guardar" onPress={() => saveNote(draft)} />
          </View>
        </View>
      ) : entry?.note ? (
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Editar tu nota"
          onPress={startEditing}
          style={({ pressed }) => ({
            gap: theme.spacing.xs,
            padding: theme.spacing.md,
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors.surface,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <AppText variant="label">Mi nota</AppText>
            <Ionicons name="create-outline" size={18} color={theme.colors.textMuted} />
          </View>
          <AppText style={{ color: theme.colors.textPrimary }}>{entry.note}</AppText>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={startEditing}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            alignSelf: "flex-start",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.colors.textSecondary} />
          <AppText>Agregar una nota</AppText>
        </Pressable>
      )}
    </View>
  );
}
