"""Carga un lote de contenido (scripts/content/lote_XX.py) en la base.

Todo entra en status="ai_generated", source="ai": queda pendiente de la
revisión de Erick en el admin. Este script NUNCA publica ni programa fechas.

Es idempotente: una frase que ya existe en la base (comparando sin
mayúsculas ni espacios extra) se salta, sin tocarla. Así se puede correr dos
veces sin duplicar, y sin pisar lo que Erick ya editó o revisó.

--check valida el lote contra docs/guia-editorial.md (largos, etiquetas,
lista negra, variedad) y, si hay base disponible, dice cuántas frases se
crearían y cuántas ya existen. No escribe nada.

Uso (cwd = raíz del repo):
    backend/.venv/Scripts/python scripts/seed_content.py lote_01 --check
    backend/.venv/Scripts/python scripts/seed_content.py lote_01
"""

import importlib.util
import re
import sys
from collections import Counter
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
CONTENT_DIR = SCRIPTS_DIR / "content"
sys.path.insert(0, str(SCRIPTS_DIR.parent / "backend"))

from app.constants import MOOD_TAGS  # noqa: E402

# Rangos de la guía editorial (sección 3). Fuera de rango = error.
LIMITS = {"quote": (40, 120), "body": (200, 600), "action": (50, 180)}
MAX_TAG_SHARE = 0.20  # ninguna etiqueta en más del 20 % del lote (sección 7)

# Lista negra (sección 4). Coincidencia sin mayúsculas, por palabra/frase.
BANNED = [
    "deberías", "deberias", "zona de confort", "mejor versión", "universo",
    "vibra", "manifestar", "nunca te rindas", "cree en ti", "todo pasa por algo",
    "no hay excusas", "éxito", "exitoso", "dios", "bendición", "como dijo",
    "chévere", "bacán", "parce", "che ",
]
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿]")


def normalize(quote: str) -> str:
    return " ".join(quote.lower().split())


def load(batch: str) -> list[dict]:
    path = CONTENT_DIR / f"{batch}.py"
    if not path.exists():
        raise SystemExit(f"No existe {path}")
    spec = importlib.util.spec_from_file_location(batch, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.REFLECTIONS


def validate(items: list[dict]) -> list[str]:
    errors: list[str] = []
    seen: set[str] = set()
    tag_count: Counter[str] = Counter()

    for i, item in enumerate(items, 1):
        label = f"#{i} «{item.get('quote', '')[:40]}…»"
        if set(item) != {"quote", "body", "action", "mood_tags"}:
            errors.append(f"{label}: campos inesperados {sorted(item)}")
            continue

        for field, (lo, hi) in LIMITS.items():
            n = len(item[field].strip())
            if not lo <= n <= hi:
                errors.append(f"{label}: {field} tiene {n} caracteres (rango {lo}-{hi})")

        key = normalize(item["quote"])
        if key in seen:
            errors.append(f"{label}: frase repetida dentro del lote")
        seen.add(key)

        tags = item["mood_tags"]
        if not 1 <= len(tags) <= 2 or len(tags) != len(set(tags)):
            errors.append(f"{label}: debe tener 1 o 2 etiquetas distintas, tiene {tags}")
        bad = [t for t in tags if t not in MOOD_TAGS]
        if bad:
            errors.append(f"{label}: etiquetas desconocidas {bad}")
        tag_count.update(tags)

        text = " ".join(item[f] for f in ("quote", "body", "action"))
        lowered = f" {text.lower()} "
        for word in BANNED:
            if re.search(rf"(?<!\w){re.escape(word.strip())}(?!\w)", lowered):
                errors.append(f"{label}: contiene «{word.strip()}» (lista negra)")
        if "!" in text or "¡" in text:
            errors.append(f"{label}: tiene signos de exclamación")
        if EMOJI.search(text):
            errors.append(f"{label}: tiene emojis")
        if item["quote"].strip()[:1] in "\"'«“":
            errors.append(f"{label}: la frase no va entre comillas")

    limit = int(len(items) * MAX_TAG_SHARE)
    for tag, n in tag_count.items():
        if n > limit:
            errors.append(f"Etiqueta «{tag}» en {n} piezas (máximo {limit} para este lote)")
    unused = [t for t in MOOD_TAGS if t not in tag_count]
    if unused:
        errors.append(f"Etiquetas sin ninguna pieza: {unused}")
    return errors


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        raise SystemExit(__doc__)
    check_only = "--check" in sys.argv

    items = load(args[0])
    errors = validate(items)
    if errors:
        print("\n".join(errors))
        print(f"\nValidación FALLÓ: {len(errors)} problema(s).")
        raise SystemExit(1)
    tags = Counter(t for item in items for t in item["mood_tags"])
    print(f"Validación OK: {len(items)} piezas.")
    print("Etiquetas: " + ", ".join(f"{t} {tags[t]}" for t in MOOD_TAGS))

    from app.database import SessionLocal
    from app.models import Reflection

    db = SessionLocal()
    try:
        existing = {normalize(q) for (q,) in db.query(Reflection.quote).all()}
        new = [it for it in items if normalize(it["quote"]) not in existing]
        print(f"Contra la base: {len(new)} nuevas, {len(items) - len(new)} ya existían.")
        if check_only:
            print("--check: no se escribió nada.")
            return
        for it in new:
            db.add(Reflection(
                quote=it["quote"].strip(),
                body=it["body"].strip(),
                action=it["action"].strip(),
                mood_tags=it["mood_tags"],
                status="ai_generated",
                source="ai",
            ))
        db.commit()
    finally:
        db.close()

    print(f"Creadas {len(new)} reflexiones en status='ai_generated'.")
    print("Revísalas en el admin (Reflexiones → filtro 'IA') y usa 'Marcar como revisadas'.")


if __name__ == "__main__":
    main()
