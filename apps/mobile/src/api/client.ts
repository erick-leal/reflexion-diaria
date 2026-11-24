const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta EXPO_PUBLIC_API_URL. Defínela en apps/mobile/.env");
}

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

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new ApiError(response.status, path);
  }
  return response.json() as Promise<T>;
}
