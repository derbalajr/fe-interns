import { useQuery } from "@tanstack/react-query";

import { getLead } from "@/api/leadApi";

export function leadQueryKey(id: number | string) {
  return ["leads", "detail", id] as const;
}

export function useLeadQuery(id: number | string) {
  return useQuery({
    queryKey: leadQueryKey(id),
    queryFn: async () => {
      const response = await getLead(id);

      return response.data;
    },
    enabled: Boolean(id),
  });
}
