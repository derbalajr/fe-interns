import { useQuery } from "@tanstack/react-query";

import { getDeal } from "@/api/dealApi";

export function dealQueryKey(id: number | string) {
  return ["deals", "detail", id] as const;
}

export function useDealQuery(id: number | string) {
  return useQuery({
    queryKey: dealQueryKey(id),
    queryFn: async () => {
      const response = await getDeal(id);

      return response.data;
    },
    enabled: Boolean(id),
  });
}