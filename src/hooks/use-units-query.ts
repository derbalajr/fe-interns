import { useQuery } from "@tanstack/react-query";

import { getUnits } from "@/api/units";

export const unitsQueryKey = ["units"] as const;

export function useUnitsQuery() {
  return useQuery({
    queryKey: unitsQueryKey,
    queryFn: getUnits,
  });
}
