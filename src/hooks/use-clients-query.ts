import { useQuery } from "@tanstack/react-query";

import { getClients } from "@/api/clientApi";

export const clientsQueryKey = ["clients"] as const;

interface UseClientsQueryParams {
  page?: number;
  enabled?: boolean;
}

export function useClientsQuery({
  page = 1,
  enabled = true,
}: UseClientsQueryParams = {}) {
  return useQuery({
    queryKey: [...clientsQueryKey, page],
    queryFn: () => getClients(page),
    enabled,
    placeholderData: (previousData) => previousData,
  });
}
