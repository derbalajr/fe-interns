import { useQuery } from "@tanstack/react-query";

import { getDeals } from "@/api/dealApi";

export const dealsQueryKey = ["deals"] as const;

interface UseDealsQueryParams {
  page?: number;
}

export function useDealsQuery({
  page = 1,
}: UseDealsQueryParams = {}) {
  return useQuery({
    queryKey: [...dealsQueryKey, page],
    queryFn: () => getDeals(page),
    placeholderData: (previousData) => previousData,
  });
}