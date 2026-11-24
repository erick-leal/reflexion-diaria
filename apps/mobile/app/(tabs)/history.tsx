import { Screen } from "../../src/components/Screen";
import { EmptyState } from "../../src/components/StateMessage";

// Placeholder: el calendario de historial llega en la Fase 6c.
export default function HistoryScreen() {
  return (
    <Screen edges={["top"]}>
      <EmptyState title="Historial" message="Muy pronto vas a poder recorrer los días anteriores." />
    </Screen>
  );
}
