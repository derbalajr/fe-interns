import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUnit } from "@/api/unitApi";

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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["unit", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["units"],
      });
    },
  });
}