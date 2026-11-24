import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resetDeviceId } from "../lib/deviceId";
import { userDelete } from "./client";

/**
 * "Borrar mis datos": borra en el servidor el usuario anónimo (con sus
 * favoritos y su diario) y después olvida el UUID local, así que la app
 * sigue con una identidad nueva y vacía. Los ajustes del teléfono se quedan.
 *
 * Orden importante: primero se cancelan las requests en vuelo (si una llega
 * después con el UUID viejo, el backend volvería a crear ese usuario), luego
 * se borra en el servidor y recién ahí se cambia el UUID.
 */
export function useDeleteMyData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries();
      await userDelete("/me");
      await resetDeviceId();
    },
    onSuccess: () => queryClient.resetQueries(),
  });
}
