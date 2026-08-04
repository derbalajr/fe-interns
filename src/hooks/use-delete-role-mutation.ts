import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRole } from "@/api/roles";
import { rolesQueryKey } from "@/hooks/use-roles-query";

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRole(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rolesQueryKey(),
      });
    },
  });
}