import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminReflection, ReflectionStatus } from "@reflexion-diaria/shared";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ReflectionForm, type ReflectionFormValues } from "../components/ReflectionForm.tsx";
import { api } from "../lib/api.ts";
import { formatDate, STATUS_LABEL } from "../lib/labels.ts";

const FILTERS: { value: "" | ReflectionStatus; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "ai_generated", label: "Borrador IA" },
  { value: "draft", label: "Borrador" },
  { value: "reviewed", label: "Revisadas" },
  { value: "published", label: "Publicadas" },
];

export default function Reflections() {
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();
  const status = (params.get("estado") ?? "") as "" | ReflectionStatus;
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState<AdminReflection | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const list = useQuery({
    queryKey: ["reflections", status, search],
    queryFn: () => api.reflections({ status, q: search.trim() }),
  });
  const stats = useQuery({ queryKey: ["stats"], queryFn: api.stats });

  // Todo lo que cambia contenido refresca listado, conteos y calendario.
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["reflections"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    queryClient.invalidateQueries({ queryKey: ["schedule"] });
  };

  const save = useMutation({
    mutationFn: (values: ReflectionFormValues) =>
      editing
        ? api.updateReflection(editing.id, editing.status === "published" ? { ...values, status: undefined } : values)
        : api.createReflection({ ...values, status: values.status === "ai_generated" ? "draft" : values.status }),
    onSuccess: () => {
      setFormOpen(false);
      refresh();
    },
  });

  const review = useMutation({
    mutationFn: (ids: number[]) => api.bulkReview(ids),
    onSuccess: () => {
      setSelected(new Set());
      refresh();
    },
  });

  const remove = useMutation({ mutationFn: (id: number) => api.deleteReflection(id), onSuccess: refresh });

  const openForm = (reflection: AdminReflection | null) => {
    save.reset();
    setEditing(reflection);
    setFormOpen(true);
  };

  const toggle = (id: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectable = (list.data ?? []).filter((r) => r.status !== "published");
  const allSelected = selectable.length > 0 && selectable.every((r) => selected.has(r.id));
  const countFor = (value: string) =>
    value === "" ? undefined : stats.data?.[value as keyof typeof stats.data];

  return (
    <>
      <div className="toolbar" style={{ justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Reflexiones</h1>
        <button className="primary" onClick={() => openForm(null)}>
          Nueva reflexión
        </button>
      </div>

      <div className="toolbar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`chip ${status === f.value ? "active" : ""}`}
            onClick={() => {
              setSelected(new Set());
              setParams(f.value ? { estado: f.value } : {});
            }}
          >
            {f.label}
            {countFor(f.value) !== undefined ? ` (${countFor(f.value)})` : ""}
          </button>
        ))}
        <input
          type="search"
          placeholder="Buscar en frase, reflexión o acción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320, marginLeft: "auto" }}
        />
      </div>

      {selectable.length > 0 ? (
        <div className="toolbar">
          <label style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}>
            <input
              type="checkbox"
              style={{ width: "auto" }}
              checked={allSelected}
              onChange={() => setSelected(allSelected ? new Set() : new Set(selectable.map((r) => r.id)))}
            />
            Seleccionar todas
          </label>
          <button className="primary" disabled={selected.size === 0 || review.isPending} onClick={() => review.mutate([...selected])}>
            {review.isPending ? "Marcando…" : `Marcar ${selected.size} como revisadas`}
          </button>
          {review.isError ? <span className="error">{review.error.message}</span> : null}
        </div>
      ) : null}

      {list.isPending ? (
        <p className="muted">Cargando…</p>
      ) : list.isError ? (
        <p className="error">{list.error.message}</p>
      ) : list.data.length === 0 ? (
        <p className="muted">No hay reflexiones con este filtro.</p>
      ) : (
        <div className="list">
          {list.data.map((r) => (
            <div className="card row" key={r.id}>
              <input
                type="checkbox"
                style={{ width: "auto", marginTop: 4 }}
                aria-label={`Seleccionar: ${r.quote}`}
                disabled={r.status === "published"}
                checked={selected.has(r.id)}
                onChange={() => toggle(r.id)}
              />
              <div className="grow">
                <div>
                  <span className={`pill status-${r.status}`}>{STATUS_LABEL[r.status]}</span>
                  {r.source === "ai" ? <span className="pill">IA</span> : null}
                  {r.mood_tags.map((t) => (
                    <span className="pill" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="quote">{r.quote}</p>
                <p className="small" style={{ margin: "2px 0" }}>
                  <b>Para hoy:</b> {r.action}
                </p>
                <p className="small" style={{ margin: 0 }}>
                  {r.scheduled_dates.length
                    ? `Programada: ${r.scheduled_dates.map(formatDate).join(", ")}`
                    : "Sin fecha"}
                  {r.reviewed_by ? ` · Revisada por ${r.reviewed_by}` : ""}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button onClick={() => openForm(r)}>Editar</button>
                {r.scheduled_dates.length === 0 ? (
                  <button
                    className="danger"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar "${r.quote}"? No se puede deshacer.`)) remove.mutate(r.id);
                    }}
                  >
                    Eliminar
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
      {remove.isError ? <p className="error">{remove.error.message}</p> : null}

      {/* Montado solo al abrir; la key fuerza un formulario nuevo por reflexion. */}
      {formOpen ? (
        <ReflectionForm
          key={editing?.id ?? "nueva"}
          reflection={editing}
          saving={save.isPending}
          error={save.isError ? save.error.message : null}
          onSubmit={(values) => save.mutate(values)}
          onClose={() => setFormOpen(false)}
        />
      ) : null}
    </>
  );
}
