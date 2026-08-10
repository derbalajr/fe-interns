import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelReservation } from "@/api/reservationApi";
import { reservationsQueryKey } from "@/hooks/use-reservations-query";
import { unitsQueryKey } from "@/hooks/use-units-query";

export function useCancelReservationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelReservation(id),

    onSuccess: async () => {
      // Cancelling returns the unit to "available".
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reservationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: unitsQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["units", "detail"] }),
      ]);
    },
  });
}
