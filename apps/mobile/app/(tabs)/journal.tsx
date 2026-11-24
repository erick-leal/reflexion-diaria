import { Screen } from "../../src/components/Screen";
import { EmptyState } from "../../src/components/StateMessage";

// Placeholder: el diario personal llega en la Fase 6d.
export default function JournalScreen() {
  return (
    <Screen edges={["top"]}>
      <EmptyState title="Diario" message="Muy pronto vas a poder anotar cómo te fue con la acción de cada día." />
    </Screen>
  );
}
