import { getDeviceId } from "../lib/deviceId";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta EXPO_PUBLIC_API_URL. Defínela en apps/mobile/.env");
}

/** Página pública de la política de privacidad (la sirve el backend). */
export const PRIVACY_URL = `${API_URL}/privacy`;

/** Error HTTP con su código, para que cada hook decida qué significa (ej. 404 = "aún no hay contenido"). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    path: string,
  ) {
    super(`${path} respondió ${status}`);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "PUT" | "DELETE";
  body?: unknown;
  /** Endpoints por usuario (favoritos, diario) necesitan la identidad anónima. */
  withDeviceId?: boolean;
}

async function request<T>(path: string, { method = "GET", body, withDeviceId = false }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (withDeviceId) headers["X-Device-Id"] = await getDeviceId();

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new ApiError(response.status, path);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

/** Contenido público (no identifica al usuario). */
export const apiGet = <T>(path: string) => request<T>(path);

/** Datos del usuario: siempre mandan X-Device-Id. */
export const userGet = <T>(path: string) => request<T>(path, { withDeviceId: true });
export const userPut = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PUT", body, withDeviceId: true });
export const userDelete = (path: string) => request<void>(path, { method: "DELETE", withDeviceId: true });
