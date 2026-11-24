import * as Sharing from "expo-sharing";
import type { RefObject } from "react";
import { PixelRatio, type View } from "react-native";
import { captureRef } from "react-native-view-shot";

/** Ancho final de la imagen en pixeles: historia 9:16 en Full HD (1080x1920). */
export const SHARE_OUTPUT_WIDTH_PX = 1080;

/**
 * Ancho en dp que debe tener la tarjeta de CAPTURA para medir exactamente
 * 1080 px fisicos en este telefono. Ojo: las opciones width/height de
 * captureRef solo ESTIRAN el bitmap de la vista (no la vuelven a dibujar),
 * asi que capturar la vista previa chica daba una imagen borrosa. Por eso se
 * captura una copia fuera de pantalla dibujada al tamano real.
 */
export function captureCardWidthDp(): number {
  return SHARE_OUTPUT_WIDTH_PX / PixelRatio.get();
}

/** "Fotografia" la vista y abre el menu de compartir de Android (WhatsApp, Instagram...). */
export async function shareViewAsImage(viewRef: RefObject<View | null>): Promise<void> {
  if (!viewRef.current) return;
  const uri = await captureRef(viewRef, { format: "png", quality: 1, result: "tmpfile" });
  if (!(await Sharing.isAvailableAsync())) return;
  await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Compartir tu paso de hoy" });
}
