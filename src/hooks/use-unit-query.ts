import { useQuery } from "@tanstack/react-query";

import { getUnit } from "@/api/unitApi";

export function unitQueryKey(id: number | string) {
  return ["units", "detail", String(id)] as const;
}

export function useUnitQuery(id: number | string) {
  return useQuery({
    queryKey: unitQueryKey(id),
    queryFn: async () => {
      const response = await getUnit(id);

      return response.data;
    },
    enabled: Boolean(id),
  });
}
