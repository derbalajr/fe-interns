import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLead } from "@/api/leadApi";
import { leadsQueryKey } from "@/hooks/use-leads-query";
import type { LeadPayload } from "@/schemas/lead-schema";

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadPayload) => createLead(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: leadsQueryKey,
      });
    },
  });
}
