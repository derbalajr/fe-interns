import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLead, type UpdateLeadPayload } from "@/api/leadApi";
import { leadQueryKey } from "@/hooks/use-lead-query";
import { leadsQueryKey } from "@/hooks/use-leads-query";

type UpdateLeadInput = {
  id: number;
  data: UpdateLeadPayload;
};

export function useUpdateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateLeadInput) => updateLead(id, data),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: leadsQueryKey,
        }),

        queryClient.invalidateQueries({
          queryKey: leadQueryKey(variables.id),
        }),
      ]);
    },
  });
}
