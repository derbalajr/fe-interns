import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginRequest } from "../api/auth";
import type { LoginCredentials } from "../types/auth";
import { profileQueryKey } from "./use-profile-query";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginRequest(credentials),

    onSuccess: async (response) => {
      queryClient.setQueryData(
        profileQueryKey,
        response.user,
      );

      await queryClient.invalidateQueries({
        queryKey: profileQueryKey,
      });
    },
  });
}