import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDeal } from "@/api/dealApi";
import { dealsQueryKey } from "@/hooks/use-deals-query";
import type { DealPayload } from "@/schemas/deal-schema";

export function useUpdateDealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: DealPayload;
    }) => updateDeal(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dealsQueryKey,
      });
    },
  });
}