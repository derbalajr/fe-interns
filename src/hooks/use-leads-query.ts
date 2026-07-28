import { useQuery } from "@tanstack/react-query";

import { getLeads } from "../api/leadApi";

export const leadsQueryKey = ["leads"] as const;

interface UseLeadsQueryParams {
  page?: number;
  search?: string;
  stage?: string;
  source?: string;
}

export function useLeadsQuery({
  page = 1,
  search = "",
  stage = "",
  source = "",
}: UseLeadsQueryParams = {}) {
  return useQuery({
    queryKey: [...leadsQueryKey, page, search, stage, source],
    queryFn: () => getLeads(page, search, stage, source),
    placeholderData: (previousData) => previousData,
  });
}
