import { useQuery } from "@tanstack/react-query";

import { getProjects } from "@/api/projectApi";

export const projectsQueryKey = ["projects"] as const;

interface UseProjectsQueryParams {
  page?: number;
}

export function useProjectsQuery({
  page = 1,
}: UseProjectsQueryParams = {}) {
  return useQuery({
    queryKey: [...projectsQueryKey, page],
    queryFn: () => getProjects(page),
    placeholderData: (previousData) => previousData,
  });
}
