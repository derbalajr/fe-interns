import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDeal } from "@/api/dealApi";
import { dealsQueryKey } from "@/hooks/use-deals-query";
import type { DealPayload } from "@/schemas/deal-schema";

export function useCreateDealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DealPayload) => createDeal(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dealsQueryKey,
      });
    },
  });
}