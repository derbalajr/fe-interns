import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createReservation } from "@/api/reservationApi";
import { reservationsQueryKey } from "@/hooks/use-reservations-query";
import { unitsQueryKey } from "@/hooks/use-units-query";
import type { CreateReservationPayload } from "@/types/reservation";

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationPayload) => createReservation(data),

    onSuccess: async () => {
      // The reserved unit flips to "reserved", so units lists and the unit
      // detail must refetch alongside the reservations list.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reservationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: unitsQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["units", "detail"] }),
      ]);
    },
  });
}
