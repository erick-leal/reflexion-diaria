import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { api } from "../lib/api.ts";
import { formatDate, STATUS_LABEL, todayISO } from "../lib/labels.ts";

/**
 * Calendario: 30 dias atras y 60 adelante. Normalmente lo llena el cron solo;
 * esto es para programar a mano una fecha especial o quitar una futura.
 */
export default function Schedule() {
  const queryClient = useQueryClient();
  const today = todayISO();
  const [date, setDate] = useState(today);
  const [reflectionId, setReflectionId] = useState("");

  const schedule = useQuery({ queryKey: ["schedule"], queryFn: api.schedule });
  // Solo las revisadas se pueden programar (el backend lo exige igual).
  const reviewed = useQuery({ queryKey: ["reflections", "reviewed", ""], queryFn: () => api.reflections({ status: "reviewed" }) });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["schedule"] });
    queryClient.invalidateQueries({ queryKey: ["reflections"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  const add = useMutation({
    mutationFn: () => api.scheduleReflection(date, Number(reflectionId)),
    onSuccess: () => {
      setReflectionId("");
      refresh();
    },
  });
  const remove = useMutation({ mutationFn: (id: number) => api.unschedule(id), onSuccess: refresh });

  const taken = new Set((schedule.data ?? []).map((d) => d.date));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    add.mutate();
  };

  return (
    <>
      <h1>Calendario</h1>

      <form className="card" onSubmit={submit} style={{ marginBottom: 20 }}>
        <h2>Programar a mano</h2>
        <div className="row">
          <div className="field" style={{ width: 190 }}>
            <label htmlFor="date">Fecha</label>
            <input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="field grow">
            <label htmlFor="reflection">Reflexión revisada</label>
            <select id="reflection" value={reflectionId} onChange={(e) => setReflectionId(e.target.value)} required>
              <option value="">
                {reviewed.data?.length === 0 ? "No hay reflexiones revisadas" : "Elige una…"}
              </option>
              {(reviewed.data ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.quote}
                </option>
              ))}
            </select>
          </div>
        </div>
        {taken.has(date) ? <p className="error">Esa fecha ya tiene una reflexión.</p> : null}
        {add.isError ? <p className="error">{add.error.message}</p> : null}
        <button className="primary" type="submit" disabled={add.isPending || taken.has(date) || !reflectionId}>
          {add.isPending ? "Programando…" : "Programar"}
        </button>
      </form>

      {schedule.isPending ? (
        <p className="muted">Cargando…</p>
      ) : schedule.isError ? (
        <p className="error">{schedule.error.message}</p>
      ) : schedule.data.length === 0 ? (
        <p className="muted">No hay fechas programadas en esta ventana (30 días atrás, 60 adelante).</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: 170 }}>Fecha</th>
              <th>Frase</th>
              <th style={{ width: 110 }}>Estado</th>
              <th style={{ width: 90 }} />
            </tr>
          </thead>
          <tbody>
            {schedule.data.map((d) => (
              <tr key={d.id} className={d.date === today ? "today" : undefined}>
                <td>
                  {formatDate(d.date)}
                  {d.date === today ? <b> · hoy</b> : null}
                </td>
                <td>{d.reflection.quote}</td>
                <td>
                  <span className={`pill status-${d.reflection.status}`}>{STATUS_LABEL[d.reflection.status]}</span>
                </td>
                <td>
                  {/* Solo futuras: hoy y el pasado ya los vieron usuarios (favoritos, diario). */}
                  {d.date > today ? (
                    <button className="danger" onClick={() => remove.mutate(d.id)} disabled={remove.isPending}>
                      Quitar
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {remove.isError ? <p className="error">{remove.error.message}</p> : null}
    </>
  );
}
