import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUnit } from "@/api/unitApi";
import { unitQueryKey } from "@/hooks/use-unit-query";
import { unitsQueryKey } from "@/hooks/use-units-query";

export function useUpdateUnitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: FormData;
    }) => updateUnit(id, data),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: unitQueryKey(variables.id),
      });

      await queryClient.invalidateQueries({
        queryKey: unitsQueryKey,
      });
    },
  });
}