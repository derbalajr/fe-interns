import {
  apiGet,
  apiPost,
} from "@/lib/fetcher";

import type {
  CreateHandoverPayload,
  HandoverResponse,
  HandoversResponse,
} from "@/types/handover";

const PER_PAGE = 100;

export function getHandovers(page = 1) {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("per_page", PER_PAGE.toString());

  return apiGet<HandoversResponse>(`/handovers?${params.toString()}`);
}

export function createHandover(
  payload: CreateHandoverPayload,
) {
  return apiPost<
    HandoverResponse,
    CreateHandoverPayload
  >("/handovers", payload);
}

export function completeHandover(
  handoverId: number,
) {
  return apiPost<HandoverResponse>(
    `/handovers/${handoverId}/complete`,
  );
}
