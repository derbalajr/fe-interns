import { apiGet, apiPatch, apiPost } from "@/lib/fetcher";

import type { UnitResponse, UnitsResponse } from "@/types/unit";

const PER_PAGE = 100;

export type UnitSort = "newest" | "oldest" | "price_asc" | "price_desc";

export interface UnitFilters {
  page?: number;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: UnitSort;
  projectId?: number;
}

export function getUnits({
  page = 1,
  type,
  status,
  minPrice,
  maxPrice,
  sort,
}: UnitFilters = {}) {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("per_page", PER_PAGE.toString());

  if (type) {
    params.set("type", type);
  }

  if (status) {
    params.set("status", status);
  }

  if (typeof minPrice === "number") {
    params.set("min_price", minPrice.toString());
  }

  if (typeof maxPrice === "number") {
    params.set("max_price", maxPrice.toString());
  }

  if (sort && sort !== "newest") {
    params.set("sort", sort);
  }

  return apiGet<UnitsResponse>(`/units?${params.toString()}`);
}

export function getUnit(id: number | string) {
  return apiGet<UnitResponse>(`/units/${id}`);
}

export function createUnit(data: FormData) {
  return apiPost<UnitResponse, FormData>("/units", data);
}

export function updateUnit(id: number, data: FormData) {
  return apiPost<UnitResponse, FormData>(`/units/${id}`, data);
}

// Marks a reserved unit as sold. The backend confirms the reservation and
// records the sale; no body is needed.
export function sellUnit(id: number) {
  return apiPatch<UnitResponse, Record<string, never>>(`/units/${id}/sell`, {});
}
