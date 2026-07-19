import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../api/auth";

export const profileQueryKey = ["auth", "profile"] as const;

type UseProfileQueryOptions = {
  enabled?: boolean;
};

export function useProfileQuery({
  enabled = true,
}: UseProfileQueryOptions = {}) {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfile,
    enabled,
  });
}