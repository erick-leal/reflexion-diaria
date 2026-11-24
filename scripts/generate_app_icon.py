"""Genera los assets de ícono y splash de "Un paso a la vez" (Fase 11).

Glifo: cuatro escalones sólidos (variante A3, elegida por Erick), en la
paleta "Claridad" (acento #1F6B52 en claro, #5CC49A en oscuro).

Uso (desde la raíz del repo; Pillow solo se instala en el venv local, no
va en requirements.txt):
    backend/.venv/Scripts/python scripts/generate_app_icon.py

Se dibuja a 4x y se reduce con LANCZOS para tener bordes suavizados.
"""

from pathlib import Path

from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).resolve().parent.parent / "apps/mobile/assets"
STORE_DIR = Path(__file__).resolve().parent.parent / "docs/play-store"

ACCENT_LIGHT = (0x1F, 0x6B, 0x52)
ACCENT_DARK = (0x5C, 0xC4, 0x9A)
WHITE = (255, 255, 255)
SS = 4  # supersampling

# Escalera en una caja de 56 x 48 unidades (origen arriba a la izquierda).
STAIRS = [(0, 48), (0, 36), (14, 36), (14, 24), (28, 24), (28, 12),
          (42, 12), (42, 0), (56, 0), (56, 48)]
GLYPH_W, GLYPH_H = 56, 48


def stairs_layer(size, glyph_width_ratio, color, bg=None):
    """Imagen cuadrada con la escalera centrada.

    glyph_width_ratio: ancho de la escalera como fracción del lado.
    """
    big = size * SS
    img = Image.new("RGBA", (big, big), bg + (255,) if bg else (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    scale = big * glyph_width_ratio / GLYPH_W
    ox = (big - GLYPH_W * scale) / 2
    oy = (big - GLYPH_H * scale) / 2
    pts = [(ox + x * scale, oy + y * scale) for x, y in STAIRS]
    draw.polygon(pts, fill=color + (255,))
    return img.resize((size, size), Image.LANCZOS)


def save(img, path, opaque=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    if opaque:
        img = img.convert("RGB")
    img.save(path, optimize=True)
    print(f"  {path.relative_to(path.parents[2])}  {img.size[0]}px")


MANROPE_DIR = Path(__file__).resolve().parent.parent / "apps/mobile/node_modules/@expo-google-fonts/manrope"
SUBTITLE_GREEN = (0xD4, 0xEE, 0xE2)


def feature_graphic():
    """Imagen destacada de Google Play (1024 x 500, sin transparencia)."""
    from PIL import ImageFont

    w, h = 1024 * SS, 500 * SS
    img = Image.new("RGB", (w, h), ACCENT_LIGHT)
    draw = ImageDraw.Draw(img)

    title = ImageFont.truetype(str(MANROPE_DIR / "700Bold/Manrope_700Bold.ttf"), 66 * SS)
    sub = ImageFont.truetype(str(MANROPE_DIR / "500Medium/Manrope_500Medium.ttf"), 30 * SS)
    lines = [("Un paso a la vez", title, WHITE, 0),
             ("Una frase, una reflexión", sub, SUBTITLE_GREEN, 24 * SS),
             ("y una acción para hoy.", sub, SUBTITLE_GREEN, 8 * SS)]

    # Escalera + texto como un solo grupo centrado en el lienzo.
    scale = 180 * SS / GLYPH_H
    gap = 56 * SS
    text_w = max(draw.textbbox((0, 0), t, font=f)[2] for t, f, _, _ in lines)
    ox = (w - (GLYPH_W * scale + gap + text_w)) / 2
    oy = (h - GLYPH_H * scale) / 2
    draw.polygon([(ox + x * scale, oy + y * scale) for x, y in STAIRS], fill=WHITE)
    tx = ox + GLYPH_W * scale + gap
    heights = [draw.textbbox((0, 0), t, font=f)[3] for t, f, _, _ in lines]
    total = sum(heights) + sum(gap for *_, gap in lines)
    y = (h - total) / 2
    for (text, font, color, gap), lh in zip(lines, heights):
        y += gap
        draw.text((tx, y), text, font=font, fill=color)
        y += lh
    return img.resize((1024, 500), Image.LANCZOS)


def main():
    # Ícono "legacy"/iOS: fondo verde a sangre (el sistema pone la máscara).
    save(stairs_layer(1024, 0.56, WHITE, ACCENT_LIGHT), OUT_DIR / "icon.png", opaque=True)

    # Adaptive icon de Android: la zona segura es un círculo de 66/108 del
    # lado. La caja de la escalera (56 x 48) tiene diagonal ~1.32 veces su
    # ancho, así que con 0.44 de ancho la diagonal queda en ~58 % y no se
    # recorta con ninguna máscara (círculo, squircle, gota).
    save(stairs_layer(1024, 0.44, WHITE), OUT_DIR / "android-icon-foreground.png")
    # Monocromo (íconos temáticos de Android 13+): solo importa el alfa.
    save(stairs_layer(1024, 0.44, WHITE), OUT_DIR / "android-icon-monochrome.png")

    # Splash: glifo transparente; el fondo lo pone expo-splash-screen.
    save(stairs_layer(1024, 0.80, ACCENT_LIGHT), OUT_DIR / "splash-icon.png")
    save(stairs_layer(1024, 0.80, ACCENT_DARK), OUT_DIR / "splash-icon-dark.png")

    save(stairs_layer(48, 0.62, WHITE, ACCENT_LIGHT), OUT_DIR / "favicon.png", opaque=True)

    # Ícono de la ficha de Google Play (512 x 512, sin transparencia).
    save(stairs_layer(512, 0.56, WHITE, ACCENT_LIGHT), STORE_DIR / "icon-512.png", opaque=True)
    save(feature_graphic(), STORE_DIR / "feature-graphic.png", opaque=True)


if __name__ == "__main__":
    main()
