import { apiGet } from "@/lib/fetcher";

import type {
  UnitResponse,
  UnitsResponse,
} from "@/types/unit";

const PER_PAGE = 100;

export function getUnits(page = 1) {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("per_page", PER_PAGE.toString());

  return apiGet<UnitsResponse>(
    `/units?${params.toString()}`,
  );
}

export function getUnit(id: number | string) {
  return apiGet<UnitResponse>(`/units/${id}`);
}