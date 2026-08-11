import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUnit } from "@/api/unitApi";
import { unitsQueryKey } from "@/hooks/use-units-query";
import type { UnitPayload } from "@/schemas/unit-schema";

export function useCreateUnitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnitPayload) => createUnit(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: unitsQueryKey });
    },
  });
}
