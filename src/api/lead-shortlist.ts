import { apiDelete, apiGet, apiPost } from "@/lib/fetcher";

import type {
  DeleteShortlistUnitResponse,
  Unit,
  UnitsResponse,
} from "@/types/unit";

export async function getLeadShortlist(
  leadId: number | string,
): Promise<Unit[]> {
  const response = await apiGet<UnitsResponse>(`/leads/${leadId}/shortlist`);

  return response.data;
}

export function addUnitToShortlist(leadId: number | string, unitId: number) {
  return apiPost<{ data: Unit }>(`/leads/${leadId}/shortlist/${unitId}`);
}

export function removeUnitFromShortlist(
  leadId: number | string,
  unitId: number,
) {
  return apiDelete<DeleteShortlistUnitResponse>(
    `/leads/${leadId}/shortlist/${unitId}`,
  );
}
