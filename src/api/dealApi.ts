import { apiGet, apiPost, apiPut } from "@/lib/fetcher";

import type { DealPayload } from "@/schemas/deal-schema";
import type { DealResponse, DealsResponse } from "@/types/deal";

export type UpdateDealPayload = DealPayload;

export function getDeals(page = 1) {
  const params = new URLSearchParams();

  params.set("page", page.toString());

  return apiGet<DealsResponse>(`/deals?${params.toString()}`);
}

export function getDeal(id: number | string) {
  return apiGet<DealResponse>(`/deals/${id}`);
}

export function createDeal(data: DealPayload) {
  return apiPost<DealResponse, DealPayload>("/deals", data);
}

export function updateDeal(id: number, data: UpdateDealPayload) {
  return apiPut<DealResponse, UpdateDealPayload>(`/deals/${id}`, data);
}