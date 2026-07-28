import { useQuery } from "@tanstack/react-query";

import { getUnits } from "@/api/unitApi";

export const unitsQueryKey = ["units"] as const;

interface UseUnitsQueryParams {
  page?: number;
}

export function useUnitsQuery({
  page = 1,
}: UseUnitsQueryParams = {}) {
  return useQuery({
    queryKey: [...unitsQueryKey, page],
    queryFn: () => getUnits(page),
    placeholderData: (previousData) => previousData,
  });
}
