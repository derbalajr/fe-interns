import { useQuery } from "@tanstack/react-query";

import { getAssignableAgents } from "@/api/agents";

export const agentsQueryKey = ["agents"] as const;

export function useAgentsQuery() {
  return useQuery({
    queryKey: agentsQueryKey,

    queryFn: async () => {
      const response = await getAssignableAgents();

      return response.data.filter((user) =>
        user.roles.some((role) => role.trim().toLowerCase() === "agent"),
      );
    },
  });
}
