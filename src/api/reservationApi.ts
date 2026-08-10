import { apiGet, apiPost } from "@/lib/fetcher";

import type {
  CreateReservationPayload,
  ReservationResponse,
  ReservationsResponse,
} from "@/types/reservation";

export function getReservations(page = 1) {
  const params = new URLSearchParams();

  params.set("page", page.toString());

  return apiGet<ReservationsResponse>(`/reservations?${params.toString()}`);
}

export function createReservation(data: CreateReservationPayload) {
  return apiPost<ReservationResponse, CreateReservationPayload>(
    "/reservations",
    data,
  );
}

export function cancelReservation(id: number) {
  return apiPost<{ message: string }>(`/reservations/${id}/cancel`);
}
