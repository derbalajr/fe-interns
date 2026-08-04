import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRole } from "@/api/roles";
import { rolesQueryKey } from "@/hooks/use-roles-query";
import type { RolePayload } from "@/schemas/role-schema";

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RolePayload;
    }) => updateRole(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rolesQueryKey(),
      });
    },
  });
}