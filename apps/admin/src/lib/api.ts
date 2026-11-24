import type {
  AdminDailyReflection,
  AdminReflection,
  AdminReflectionCreate,
  AdminReflectionUpdate,
  AdminStats,
} from "@reflexion-diaria/shared";

import { auth } from "./firebase";

// URL publica del backend. Se puede apuntar a uno local con VITE_API_URL
// (apps/admin/.env), pero por defecto usa produccion: el deploy no necesita variables.
const API_URL = import.meta.env.VITE_API_URL ?? "https://reflexion-diaria-production.up.railway.app";

export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new ApiError(401, "Sesión cerrada");
  // getIdToken() renueva solo el token si esta por vencer (duran 1 hora).
  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  if (!response.ok) {
    // FastAPI responde {"detail": "..."} (string) o una lista de errores de validacion.
    const data = await response.json().catch(() => null);
    const detail = data?.detail;
    const message = typeof detail === "string" ? detail : `Error ${response.status}`;
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  me: () => request<{ email: string }>("/admin/me"),
  stats: () => request<AdminStats>("/admin/reflections/stats"),
  reflections: (params: { status?: string; q?: string }) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return request<AdminReflection[]>(`/admin/reflections${qs.size ? `?${qs}` : ""}`);
  },
  createReflection: (body: AdminReflectionCreate) =>
    request<AdminReflection>("/admin/reflections", { method: "POST", body }),
  updateReflection: (id: number, body: AdminReflectionUpdate) =>
    request<AdminReflection>(`/admin/reflections/${id}`, { method: "PUT", body }),
  deleteReflection: (id: number) => request<void>(`/admin/reflections/${id}`, { method: "DELETE" }),
  bulkReview: (ids: number[]) =>
    request<AdminReflection[]>("/admin/reflections/bulk-review", { method: "POST", body: { ids } }),
  schedule: () => request<AdminDailyReflection[]>("/admin/daily-reflections"),
  scheduleReflection: (date: string, reflectionId: number) =>
    request<AdminDailyReflection>("/admin/daily-reflections", {
      method: "POST",
      body: { date, reflection_id: reflectionId },
    }),
  unschedule: (dailyId: number) => request<void>(`/admin/daily-reflections/${dailyId}`, { method: "DELETE" }),
};
