import calendar
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

# La mayoria de la audiencia esperada esta en America Latina. Un corte fijo
# en esta zona evita que el "dia" cambie horas antes de la medianoche real
# del usuario (lo que pasaba con UTC puro, ver CLAUDE.md).
APP_TIMEZONE = ZoneInfo("America/Bogota")


def today() -> date:
    return datetime.now(APP_TIMEZONE).date()


def yesterday() -> date:
    return today() - timedelta(days=1)


def month_bounds(month: str | None) -> tuple[date, date]:
    """'YYYY-MM' -> (primer dia, ultimo dia). None = mes actual. ValueError si es invalido."""
    if month is None:
        first = today().replace(day=1)
    else:
        first = datetime.strptime(month, "%Y-%m").date()
    last = first.replace(day=calendar.monthrange(first.year, first.month)[1])
    return first, last
