import { apiGet } from "@/lib/fetcher";

import type { Unit, UnitsResponse } from "@/types/unit";

export async function getUnits(): Promise<Unit[]> {
  const response = await apiGet<UnitsResponse>("/units?per_page=100");

  return response.data;
}