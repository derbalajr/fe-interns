import { useQuery } from "@tanstack/react-query";

import { getProject } from "@/api/projectApi";

export function projectQueryKey(id: number | string) {
  return ["projects", "detail", String(id)] as const;
}

export function useProjectQuery(id: number | string) {
  return useQuery({
    queryKey: projectQueryKey(id),
    queryFn: async () => {
      const response = await getProject(id);

      return response.data;
    },
    enabled: Boolean(id),
  });
}
