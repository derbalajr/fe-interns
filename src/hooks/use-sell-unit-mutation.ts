import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sellUnit } from "@/api/unitApi";
import { reservationsQueryKey } from "@/hooks/use-reservations-query";
import { unitsQueryKey } from "@/hooks/use-units-query";

export function useSellUnitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sellUnit(id),

    onSuccess: async () => {
      // Selling flips the unit to "sold" and confirms its reservation, so unit
      // lists, the unit detail, and reservations all need to refetch.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: unitsQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["units", "detail"] }),
        queryClient.invalidateQueries({ queryKey: reservationsQueryKey }),
      ]);
    },
  });
}
