import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUser } from "@/api/users";
import { usersQueryKey } from "@/hooks/use-users-query";
import type { UserFormValues } from "@/schemas/user-schema";

type UpdateUserInput = {
  id: number;
  data: UserFormValues;
};

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserInput) =>
      updateUser(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueryKey,
      });
    },
  });
}