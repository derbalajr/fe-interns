import { useQuery } from "@tanstack/react-query";

import { getLeadShortlist } from "@/api/lead-shortlist";

export function leadShortlistQueryKey(leadId: number | string) {
  return ["leads", String(leadId), "shortlist"] as const;
}

export function useLeadShortlistQuery(leadId: number | string) {
  return useQuery({
    queryKey: leadShortlistQueryKey(leadId),
    queryFn: () => getLeadShortlist(leadId),
    enabled: Boolean(leadId),
  });
}
