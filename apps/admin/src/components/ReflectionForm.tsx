import { MOOD_TAG_LABELS, MOOD_TAGS, type AdminReflection, type MoodTag } from "@reflexion-diaria/shared";
import { useEffect, useRef, useState, type FormEvent } from "react";

export interface ReflectionFormValues {
  quote: string;
  body: string;
  action: string;
  mood_tags: MoodTag[];
  status: "draft" | "ai_generated" | "reviewed";
}

interface Props {
  /** null = crear una nueva. */
  reflection: AdminReflection | null;
  saving: boolean;
  error: string | null;
  onSubmit: (values: ReflectionFormValues) => void;
  onClose: () => void;
}

function initialValues(reflection: AdminReflection | null): ReflectionFormValues {
  if (!reflection) return { quote: "", body: "", action: "", mood_tags: [], status: "draft" };
  return {
    quote: reflection.quote,
    body: reflection.body,
    action: reflection.action,
    mood_tags: reflection.mood_tags,
    // "published" no se elige a mano: se muestra aparte y no se cambia aqui.
    status: reflection.status === "published" ? "reviewed" : reflection.status,
  };
}

/**
 * Se monta SOLO mientras esta abierto (el padre lo renderiza con una `key`):
 * asi el estado inicial se calcula una vez al abrir, sin un efecto que lo
 * "resetee" (eso causaba un render de mas).
 */
export function ReflectionForm({ reflection, saving, error, onSubmit, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [values, setValues] = useState<ReflectionFormValues>(() => initialValues(reflection));
  const isPublished = reflection?.status === "published";

  // <dialog> nativo: showModal() da foco, Escape para cerrar y backdrop gratis.
  // Abrirlo es sincronizar con el DOM (sistema externo): aqui si va un efecto.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const set = <K extends keyof ReflectionFormValues>(key: K, value: ReflectionFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const toggleTag = (tag: MoodTag) =>
    set("mood_tags", values.mood_tags.includes(tag) ? values.mood_tags.filter((t) => t !== tag) : [...values.mood_tags, tag]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <dialog ref={dialogRef} onClose={onClose}>
      <form onSubmit={submit}>
        <h2>{reflection ? "Editar reflexión" : "Nueva reflexión"}</h2>
        {isPublished ? (
          <p className="notice">
            Está publicada: los cambios de texto se ven de inmediato en la app (útil para corregir erratas).
          </p>
        ) : null}

        <div className="field">
          <label htmlFor="quote">Frase (original, sin autor)</label>
          <textarea id="quote" rows={2} maxLength={300} value={values.quote} onChange={(e) => set("quote", e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="body">Reflexión</label>
          <textarea id="body" rows={5} maxLength={2000} value={values.body} onChange={(e) => set("body", e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="action">Acción para hoy</label>
          <textarea id="action" rows={2} maxLength={500} value={values.action} onChange={(e) => set("action", e.target.value)} required />
        </div>
        <div className="field">
          <label>Estados de ánimo</label>
          <div className="tags">
            {MOOD_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`tag-toggle ${values.mood_tags.includes(tag) ? "on" : ""}`}
                aria-pressed={values.mood_tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                {MOOD_TAG_LABELS[tag]}
              </button>
            ))}
          </div>
        </div>
        {!isPublished ? (
          <div className="field">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={values.status}
              onChange={(e) => set("status", e.target.value as ReflectionFormValues["status"])}
            >
              <option value="draft">Borrador</option>
              {reflection?.status === "ai_generated" ? <option value="ai_generated">Borrador IA (sin revisar)</option> : null}
              <option value="reviewed">Revisada (lista para el cron)</option>
            </select>
          </div>
        ) : null}

        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="primary" type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
