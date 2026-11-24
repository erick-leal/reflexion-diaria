"""Cron diario: mantiene programados hoy y los próximos días.

Corre como Railway Cron Job (servicio `auto-schedule`, cwd = backend/):
    python -m scripts.auto_schedule            # programa y publica
    python -m scripts.auto_schedule --dry-run  # muestra qué haría, no escribe

Para cada fecha de [hoy, hoy + BUFFER_DAYS) sin `daily_reflections`, elige:
  1. Una reflexión "reviewed" al azar (revisada por Erick, nunca programada).
  2. Si no quedan: una "published" que no se haya mostrado en los últimos
     REPEAT_COOLDOWN_DAYS días, empezando por la que se usó hace más tiempo.
     Ya pasó por revisión humana, así que no rompe la regla editorial.
  3. Si todas están dentro del cooldown: la publicada usada hace más tiempo.
     Repetir es mejor que dejar /daily-reflection en 404.
Nunca toma "draft" ni "ai_generated": la IA no publica sola.

Sale con exit code 1 si alguna fecha queda sin contenido, para que Railway
marque la corrida en rojo. En Versículo Diario el cron salía con 0 y hubo
12 días de 404 con el cron "en verde" (ver CLAUDE.md, gotcha #10).

Es idempotente: las fechas que ya tienen contenido no se tocan (tampoco las
que Erick programó a mano en el calendario del admin).
"""

import sys
from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.dates import today
from app.models import DailyReflection, Reflection

BUFFER_DAYS = 3
REPEAT_COOLDOWN_DAYS = 90
LOW_POOL_WARNING = 7


def pick_reflection(db: Session, day: date, exclude: set[int]) -> tuple[Reflection | None, str]:
    # 1. Contenido nuevo: revisado y nunca programado.
    candidate = db.scalars(
        select(Reflection)
        .where(Reflection.status == "reviewed", Reflection.id.not_in(exclude))
        .order_by(func.random())
        .limit(1)
    ).first()
    if candidate is not None:
        return candidate, "nueva"

    # 2/3. Reutilizar publicadas, la usada hace más tiempo primero. El cooldown
    # se mide contra la fecha que se está llenando, no contra hoy.
    last_used = func.max(DailyReflection.date)
    rows = db.execute(
        select(Reflection, last_used)
        .outerjoin(DailyReflection, DailyReflection.reflection_id == Reflection.id)
        .where(Reflection.status == "published", Reflection.id.not_in(exclude))
        .group_by(Reflection.id)
        .order_by(last_used.asc().nulls_first(), func.random())
    ).all()
    if not rows and exclude:
        # Ni siquiera alcanzan las publicadas para no repetir dentro del
        # colchón: se repite antes que dejar el día vacío.
        return pick_reflection(db, day, set())
    if not rows:
        return None, ""
    reflection, used_on = rows[0]
    if used_on is None or used_on <= day - timedelta(days=REPEAT_COOLDOWN_DAYS):
        return reflection, f"reutilizada (última vez {used_on})"
    return reflection, f"reutilizada DENTRO del cooldown (última vez {used_on}): falta contenido nuevo"


def run(db: Session) -> int:
    """Llena las fechas faltantes en la sesión dada (sin commit). Devuelve el exit code."""
    start = today()
    needed = [start + timedelta(days=i) for i in range(BUFFER_DAYS)]
    taken = set(db.scalars(select(DailyReflection.date).where(DailyReflection.date.in_(needed))))
    missing = [d for d in needed if d not in taken]

    # No repetir dentro del mismo colchón lo que ya está programado alrededor.
    exclude = set(
        db.scalars(select(DailyReflection.reflection_id).where(DailyReflection.date >= start))
    )

    print(f"Hoy (America/Bogota): {start}. Fechas sin contenido: {[str(d) for d in missing] or 'ninguna'}")
    failed: list[date] = []
    for day in missing:
        reflection, how = pick_reflection(db, day, exclude)
        if reflection is None:
            failed.append(day)
            continue
        exclude.add(reflection.id)
        db.add(DailyReflection(date=day, reflection_id=reflection.id))
        reflection.status = "published"
        print(f"  {day}: #{reflection.id} [{how}] {reflection.quote[:60]}")
    db.flush()

    remaining = db.scalar(select(func.count(Reflection.id)).where(Reflection.status == "reviewed"))
    print(f"Quedan {remaining} reflexiones 'reviewed' sin programar.")
    if remaining < LOW_POOL_WARNING:
        print(
            f"AVISO: menos de {LOW_POOL_WARNING} revisadas. Revisa contenido nuevo en el admin "
            "o el cron empezará a repetir reflexiones publicadas.",
            file=sys.stderr,
        )

    if failed:
        print(
            f"ERROR: sin contenido para {[str(d) for d in failed]}. No hay reflexiones "
            "'reviewed' ni 'published'. /daily-reflection va a responder 404: revisa "
            "contenido en el admin y vuelve a correr el cron.",
            file=sys.stderr,
        )
        return 1
    return 0


def main() -> int:
    from app.database import SessionLocal

    dry_run = "--dry-run" in sys.argv
    with SessionLocal() as db:
        code = run(db)
        if dry_run:
            db.rollback()
            print("--dry-run: no se escribió nada.")
        else:
            db.commit()
    return code


if __name__ == "__main__":
    sys.exit(main())
