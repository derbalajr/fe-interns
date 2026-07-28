import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addUnitToShortlist } from "@/api/lead-shortlist";
import { leadShortlistQueryKey } from "@/hooks/use-lead-shortlist-query";

type AddShortlistUnitVariables = {
  leadId: number | string;
  unitId: number;
};

export function useAddShortlistUnitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, unitId }: AddShortlistUnitVariables) =>
      addUnitToShortlist(leadId, unitId),

    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: leadShortlistQueryKey(variables.leadId),
      });
    },
  });
}