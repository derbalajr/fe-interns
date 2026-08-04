import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRole } from "@/api/roles";
import { rolesQueryKey } from "@/hooks/use-roles-query";
import type { RolePayload } from "@/schemas/role-schema";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RolePayload) => createRole(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rolesQueryKey(),
      });
    },
  });
}