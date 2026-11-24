import type { ReflectionStatus } from "@reflexion-diaria/shared";

// Placeholder de la Fase 1. Login (Firebase propio) y CRUD de contenido llegan en la Fase 9.
const flow: ReflectionStatus[] = ["draft", "ai_generated", "reviewed", "published"];

export default function App() {
  return (
    <main style={{ fontFamily: "system-ui", padding: 32 }}>
      <h1>Un paso a la vez — Admin</h1>
      <p>Flujo editorial: {flow.join(" → ")}</p>
    </main>
  );
}
