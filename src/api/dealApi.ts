import { apiGet, apiPost, apiPut } from "@/lib/fetcher";

import type { DealPayload } from "@/schemas/deal-schema.ts";
import type { DealResponse, DealsResponse } from "@/types/deal.ts";

export type UpdateDealPayload = DealPayload;

const PER_PAGE = 100;

export function getDeals(page = 1) {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("per_page", PER_PAGE.toString());

  return apiGet<DealsResponse>(`/deals?${params.toString()}`);
}

export function getDeal(id: number | string) {
  return apiGet<DealResponse>(`/deals/${id}`);
}

export function createDeal(data: DealPayload) {
  return apiPost<DealResponse, DealPayload>("/deals", data);
}

export function updateDeal(id: number, data: UpdateDealPayload) {
  return apiPut<DealResponse, UpdateDealPayload>(
    `/deals/${id}`,
    data,
  );
}