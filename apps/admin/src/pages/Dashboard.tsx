import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { api } from "../lib/api.ts";

// El cron mantiene 3 dias programados por delante. Si el colchon o las
// "revisadas" se acaban, la app se queda sin contenido: en Versiculo eso dejo
// /daily-verse en 404 doce dias sin que nadie lo notara. Aqui se avisa antes.
const MIN_AHEAD = 3;
const LOW_REVIEWED = 7;

export default function Dashboard() {
  const stats = useQuery({ queryKey: ["stats"], queryFn: api.stats });

  if (stats.isPending) return <p className="muted">Cargando…</p>;
  if (stats.isError) return <p className="error">{stats.error.message}</p>;
  const s = stats.data;

  const cards = [
    { label: "Borradores IA (por revisar)", value: s.ai_generated },
    { label: "Borradores", value: s.draft },
    { label: "Revisadas (listas para el cron)", value: s.reviewed },
    { label: "Publicadas", value: s.published },
    { label: "Días programados por delante", value: s.scheduled_ahead },
  ];

  return (
    <>
      <h1>Resumen</h1>
      {s.scheduled_ahead < MIN_AHEAD ? (
        <div className="notice">
          Solo hay {s.scheduled_ahead} día(s) programado(s) por delante. Si el cron no encuentra reflexiones revisadas,
          la app se queda sin la reflexión de hoy. <Link to="/calendario">Ver calendario</Link>
        </div>
      ) : null}
      {s.reviewed < LOW_REVIEWED ? (
        <div className="notice">
          Quedan {s.reviewed} reflexiones revisadas: alcanzan para ~{s.reviewed} días.{" "}
          {s.ai_generated > 0 ? (
            <Link to="/reflexiones?estado=ai_generated">Revisar {s.ai_generated} borradores de IA</Link>
          ) : (
            "Hace falta cargar contenido nuevo."
          )}
        </div>
      ) : null}
      <div className="stats">
        {cards.map((c) => (
          <div className="card stat" key={c.label}>
            <div className="label">{c.label}</div>
            <div className="value">{c.value}</div>
          </div>
        ))}
      </div>
      <p className="muted">
        Flujo: borrador IA → lo revisas y lo marcas como <b>revisada</b> → el cron lo programa y publica solo, un día a
        la vez. Nada llega a la app sin pasar por ti.
      </p>
    </>
  );
}
