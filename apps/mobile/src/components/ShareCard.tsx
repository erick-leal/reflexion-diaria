import type { Ref } from "react";
import { Text, View } from "react-native";
import type { Reflection } from "@reflexion-diaria/shared";

import { fontFamilies } from "../theme/typography";

// Fondos FIJOS de la identidad Claridad (no dependen del modo claro/oscuro de
// la app: la imagen se ve igual en el telefono de quien la recibe). Planos,
// sin imagenes: pesan nada y salen nitidos a 1080x1920. Contraste AA
// verificado para cada par texto/fondo (Fase 8).
export const SHARE_BACKGROUNDS = {
  green: {
    label: "Verde",
    bg: "#1F6B52",
    text: "#FFFFFF",
    boxBg: "#16533F", // mas oscuro que el fondo: con #2C7E63 la etiqueta quedaba en 3.87:1 (no AA)
    boxLabel: "#CDEBDD",
    boxText: "#FFFFFF",
    mark: "#CDEBDD",
  },
  light: {
    label: "Claro",
    bg: "#F6F8F6",
    text: "#15201C",
    boxBg: "#DDEFE6",
    boxLabel: "#1F6B52",
    boxText: "#0E3D2E",
    mark: "#5F6E68",
  },
  night: {
    label: "Noche",
    bg: "#0F1513",
    text: "#E8EEEB",
    boxBg: "#16342A",
    boxLabel: "#6FD0A6",
    boxText: "#D3EFE2",
    mark: "#8FA19A",
  },
} as const;

export type ShareBackground = keyof typeof SHARE_BACKGROUNDS;

/** Ancho de referencia del diseño: todas las medidas escalan respecto de este. */
const BASE_WIDTH = 280;

interface ShareCardProps {
  reflection: Reflection;
  background: ShareBackground;
  note?: string | null;
  /** Ancho en dp; el alto sale de la proporcion 9:16. */
  width: number;
  /** Bordes redondeados: si en la vista previa, NO en la imagen final (quedarian esquinas transparentes). */
  rounded?: boolean;
  ref?: Ref<View>;
}

/**
 * Tarjeta 9:16. Se usa dos veces: como vista previa (chica, adaptada al alto
 * de la pantalla) y como copia de captura (1080 px reales). Todas las medidas
 * se multiplican por `s` para que ambas sean identicas salvo el tamaño.
 * Usa <Text> con colores propios (no AppText): no hereda el tema de la app.
 */
export function ShareCard({ reflection, background, note, width, rounded = true, ref }: ShareCardProps) {
  const c = SHARE_BACKGROUNDS[background];
  const s = width / BASE_WIDTH;

  return (
    // collapsable={false}: Android a veces "aplana" vistas sin estilo propio y
    // view-shot no encuentra que capturar.
    <View
      ref={ref}
      collapsable={false}
      style={{
        width,
        aspectRatio: 9 / 16,
        backgroundColor: c.bg,
        borderRadius: rounded ? 18 * s : 0,
        overflow: "hidden",
        paddingHorizontal: 22 * s,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", gap: 16 * s }}>
        <Text
          style={{ fontFamily: fontFamilies.bold, fontSize: 22 * s, lineHeight: 29 * s, color: c.text }}
          numberOfLines={note ? 5 : 7}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {reflection.quote}
        </Text>

        <View
          style={{
            backgroundColor: c.boxBg,
            borderRadius: 10 * s,
            paddingVertical: 10 * s,
            paddingHorizontal: 12 * s,
            gap: 4 * s,
          }}
        >
          <Text style={label(s, c.boxLabel)}>PARA HOY</Text>
          <Text style={body(s, c.boxText)} numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.7}>
            {reflection.action}
          </Text>
        </View>

        {note ? (
          <View style={{ borderTopWidth: Math.max(1, s), borderColor: c.mark, paddingTop: 10 * s, gap: 4 * s }}>
            <Text style={label(s, c.mark)}>MI NOTA</Text>
            {/* Sin italic: Manrope no trae cursiva cargada y Android la falsearia. */}
            <Text style={body(s, c.text)} numberOfLines={4} adjustsFontSizeToFit minimumFontScale={0.6}>
              {note}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        style={{
          fontFamily: fontFamilies.medium,
          fontSize: 11 * s,
          color: c.mark,
          textAlign: "center",
          paddingBottom: 18 * s,
        }}
      >
        Un paso a la vez
      </Text>
    </View>
  );
}

const label = (s: number, color: string) => ({
  fontFamily: fontFamilies.bold,
  fontSize: 10 * s,
  letterSpacing: 1 * s,
  color,
});

const body = (s: number, color: string) => ({
  fontFamily: fontFamilies.regular,
  fontSize: 13 * s,
  lineHeight: 19 * s,
  color,
});
