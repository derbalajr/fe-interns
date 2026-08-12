import { useQuery } from "@tanstack/react-query";

import { getUnits, type UnitFilters } from "@/api/unitApi";

export const unitsQueryKey = ["units"] as const;

export function useUnitsQuery(filters: UnitFilters = {}) {
  const { page = 1, type, status, minPrice, maxPrice, sort, projectId } = filters;

  return useQuery({
    // Every filter is part of the key so react-query caches each
    // server-side result set independently.
    queryKey: [
      ...unitsQueryKey,
      { page, type, status, minPrice, maxPrice, sort, projectId },
    ],
    queryFn: () => getUnits(filters),
    placeholderData: (previousData) => previousData,
  });
}
