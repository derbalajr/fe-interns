import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createUser } from "@/api/users";
import { usersQueryKey } from "@/hooks/use-users-query";
import type { UserFormValues } from "@/schemas/user-schema";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserFormValues) => createUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKey,
      });
    },
  });
}