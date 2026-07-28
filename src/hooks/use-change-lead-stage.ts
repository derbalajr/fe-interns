import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  changeLeadStage,
  type ChangeLeadStagePayload,
} from "@/api/leadApi";
import { leadQueryKey } from "@/hooks/use-lead-query";

type ChangeLeadStageVariables = {
  leadId: number;
  data: ChangeLeadStagePayload;
};

export function useChangeLeadStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      data,
    }: ChangeLeadStageVariables) =>
      changeLeadStage(leadId, data),

    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: leadQueryKey(variables.leadId),
        }),

        queryClient.invalidateQueries({
          queryKey: ["leads"],
        }),
      ]);
    },
  });
}