import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeHandover } from "@/api/handoverApi";
import { handoversQueryKey } from "@/hooks/use-handovers-query";

export function useCompleteHandoverMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeHandover,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: handoversQueryKey,
      });
    },
  });
}