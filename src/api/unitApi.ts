import { apiGet, apiPost } from "@/lib/fetcher";

import type { UnitPayload } from "@/schemas/unit-schema";
import type { UnitResponse, UnitsResponse } from "@/types/unit";

const PER_PAGE = 100;

/**
 * Server-side unit filters, mirroring the Laravel `FilterUnitRequest`
 * contract (see be-interns UnitController@index). `project_id` is NOT a
 * backend filter yet, so project scoping is applied on the client.
 */
export type UnitSort = "newest" | "oldest" | "price_asc" | "price_desc";

export interface UnitFilters {
  page?: number;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: UnitSort;
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

  // The backend defaults to "latest" (newest first), so only send an
  // explicit sort when it differs from that default.
  if (sort && sort !== "newest") {
    params.set("sort", sort);
  }

  return apiGet<UnitsResponse>(`/units?${params.toString()}`);
}

export function getUnit(id: number | string) {
  return apiGet<UnitResponse>(`/units/${id}`);
}

export function createUnit(data: UnitPayload) {
  return apiPost<UnitResponse, UnitPayload>("/units", data);
}
