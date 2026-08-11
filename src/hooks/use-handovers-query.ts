import { useQuery } from "@tanstack/react-query";

import { getHandovers } from "@/api/handoverApi";

export const handoversQueryKey = ["handovers"] as const;

interface UseHandoversQueryParams {
  page?: number;
}

export function useHandoversQuery({ page = 1 }: UseHandoversQueryParams = {}) {
  return useQuery({
    queryKey: [...handoversQueryKey, page],
    queryFn: () => getHandovers(page),
    placeholderData: (previousData) => previousData,
  });
}
