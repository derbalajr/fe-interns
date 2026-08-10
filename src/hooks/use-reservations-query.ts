import { useQuery } from "@tanstack/react-query";

import { getReservations } from "@/api/reservationApi";

export const reservationsQueryKey = ["reservations"] as const;

interface UseReservationsQueryParams {
  page?: number;
}

export function useReservationsQuery({
  page = 1,
}: UseReservationsQueryParams = {}) {
  return useQuery({
    queryKey: [...reservationsQueryKey, page],
    queryFn: () => getReservations(page),
    placeholderData: (previousData) => previousData,
  });
}
