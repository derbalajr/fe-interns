import { useQuery } from "@tanstack/react-query";

import { getUsers } from "../api/users";

export const usersQueryKey = ["users"] as const;

export function useUsersQuery() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000,
  });
}
