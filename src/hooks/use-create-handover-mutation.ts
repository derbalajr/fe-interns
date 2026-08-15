import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createHandover } from "@/api/handoverApi";
import { handoversQueryKey } from "@/hooks/use-handovers-query";

export function useCreateHandoverMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHandover,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: handoversQueryKey,
      });
    },
  });
}