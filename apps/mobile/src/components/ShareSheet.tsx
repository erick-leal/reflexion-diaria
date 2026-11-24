import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Switch, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { DailyReflection } from "@reflexion-diaria/shared";

import { useJournalEntry } from "../api/useJournal";
import { captureCardWidthDp, shareViewAsImage } from "../lib/shareImage";
import { useTheme } from "../theme";
import { AppText } from "./AppText";
import { Button } from "./Button";
import { SHARE_BACKGROUNDS, ShareCard, type ShareBackground } from "./ShareCard";

const BACKGROUND_KEYS = Object.keys(SHARE_BACKGROUNDS) as ShareBackground[];

// Alto (dp) de lo que NO es la tarjeta dentro de la hoja: encabezado, fila de
// fondos, boton y espaciados. La tarjeta usa el resto, para que tarjeta,
// colores y boton entren en pantalla sin scroll (pedido de Erick).
const HEADER_H = 60;
const SWATCHES_H = 66;
const BUTTON_H = 44;
const NOTE_ROW_H = 40;
const GAP = 24;
const MAX_PREVIEW_WIDTH = 280;
const MIN_PREVIEW_WIDTH = 150;

function previewWidth(windowWidth: number, windowHeight: number, topInset: number, bottomInset: number, hasNote: boolean) {
  const items = hasNote ? 4 : 3; // tarjeta, fondos, [nota], boton
  const fixed =
    HEADER_H + SWATCHES_H + BUTTON_H + (hasNote ? NOTE_ROW_H : 0) + GAP * (items - 1) + GAP * 2 + bottomInset + 16;
  // Se deja un margen arriba (topInset + 24) para que se vea que es una hoja sobre la app.
  const cardHeight = windowHeight - topInset - 24 - fixed;
  const width = Math.min(MAX_PREVIEW_WIDTH, (cardHeight * 9) / 16, windowWidth - GAP * 2);
  return Math.max(MIN_PREVIEW_WIDTH, Math.floor(width));
}

interface ShareSheetProps {
  daily: DailyReflection;
  visible: boolean;
  onClose: () => void;
}

/** Hoja inferior: vista previa de la tarjeta, elegir fondo, sumar la nota y compartir. */
export function ShareSheet({ daily, visible, onClose }: ShareSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const { data: entry } = useJournalEntry(daily.id);
  const [background, setBackground] = useState<ShareBackground>("green");
  const [includeNote, setIncludeNote] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [failed, setFailed] = useState(false);
  const cardRef = useRef<View>(null);
  const note = entry?.note ?? null;
  const cardWidth = previewWidth(window.width, window.height, insets.top, insets.bottom, Boolean(note));
  const cardNote = includeNote ? note : null;

  const handleShare = async () => {
    setSharing(true);
    setFailed(false);
    try {
      await shareViewAsImage(cardRef);
    } catch {
      setFailed(true);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}>
        {/* Copia de CAPTURA: fuera de la pantalla, dibujada a 1080 px reales
            (la vista previa es chica; estirarla daria una imagen borrosa). */}
        <View style={{ position: "absolute", left: -10000, top: 0 }} pointerEvents="none">
          <ShareCard
            ref={cardRef}
            reflection={daily.reflection}
            background={background}
            note={cardNote}
            width={captureCardWidthDp()}
            rounded={false}
          />
        </View>

        <View
          style={{
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: theme.radii.lg,
            borderTopRightRadius: theme.radii.lg,
            maxHeight: window.height - insets.top - 24,
            paddingBottom: insets.bottom + theme.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: theme.spacing.lg,
              paddingBottom: theme.spacing.sm,
            }}
          >
            <AppText variant="title">Compartir</AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ alignItems: "center", padding: theme.spacing.lg, gap: theme.spacing.lg }}>
            <ShareCard reflection={daily.reflection} background={background} note={cardNote} width={cardWidth} />

            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Fondo"
              style={{ flexDirection: "row", gap: theme.spacing.md }}
            >
              {BACKGROUND_KEYS.map((key) => {
                const selected = key === background;
                const c = SHARE_BACKGROUNDS[key];
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="radio"
                    accessibilityLabel={c.label}
                    accessibilityState={{ selected }}
                    onPress={() => setBackground(key)}
                    style={{ alignItems: "center", gap: theme.spacing.xs }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        borderWidth: 2,
                        borderColor: selected ? theme.colors.accent : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: c.bg,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                        }}
                      />
                    </View>
                    <AppText variant="caption">{c.label}</AppText>
                  </Pressable>
                );
              })}
            </View>

            {note ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  alignSelf: "stretch",
                }}
              >
                <AppText>Incluir mi nota</AppText>
                <Switch
                  accessibilityLabel="Incluir mi nota"
                  value={includeNote}
                  onValueChange={setIncludeNote}
                  trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                  thumbColor={theme.colors.background}
                />
              </View>
            ) : null}

            {failed ? (
              <AppText variant="caption" style={{ color: theme.colors.error }}>
                No se pudo preparar la imagen. Inténtalo de nuevo.
              </AppText>
            ) : null}

            <View style={{ alignSelf: "stretch" }}>
              <Button label={sharing ? "Preparando…" : "Compartir imagen"} onPress={handleShare} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
