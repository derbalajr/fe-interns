import { useQuery } from "@tanstack/react-query";

import { getRoles } from "@/api/roles";

export function rolesQueryKey() {
  return ["roles"] as const;
}

export function useRolesQuery() {
  return useQuery({
    queryKey: rolesQueryKey(),
    queryFn: async () => {
      const response = await getRoles();

      return response.data;
    },
  });
}