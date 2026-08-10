import { useQuery } from "@tanstack/react-query";

import { getPermissions } from "@/api/roles";

export function permissionsQueryKey() {
  return ["permissions"] as const;
}

export function usePermissionsQuery() {
  return useQuery({
    queryKey: permissionsQueryKey(),
    queryFn: async () => {
      const response = await getPermissions();

      return response.data;
    },
  });
}