import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assignLead, type AssignLeadPayload } from "@/api/leadApi";
import { leadQueryKey } from "@/hooks/use-lead-query";
import { leadsQueryKey } from "@/hooks/use-leads-query";

type AssignLeadInput = {
  id: number;
  data: AssignLeadPayload;
};

export function useAssignLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: AssignLeadInput) => assignLead(id, data),

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
