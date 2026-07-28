import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeUnitFromShortlist } from "@/api/lead-shortlist";
import { leadShortlistQueryKey } from "@/hooks/use-lead-shortlist-query";

type RemoveShortlistUnitVariables = {
  leadId: number | string;
  unitId: number;
};

export function useRemoveShortlistUnitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, unitId }: RemoveShortlistUnitVariables) =>
      removeUnitFromShortlist(leadId, unitId),

    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: leadShortlistQueryKey(variables.leadId),
      });
    },
  });
}
