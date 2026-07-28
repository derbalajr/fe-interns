import { apiGet } from "@/lib/fetcher";

import type { Unit, UnitsResponse } from "@/types/unit";

function getUnitsPage(page: number) {
  const params = new URLSearchParams({
    page: String(page),
  });

  return apiGet<UnitsResponse>(`/units?${params.toString()}`);
}

export async function getUnits(): Promise<Unit[]> {
  const firstPage = await getUnitsPage(1);
  const lastPage = firstPage.meta?.last_page ?? 1;

  if (lastPage === 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) => getUnitsPage(index + 2)),
  );

  return [
    ...firstPage.data,
    ...remainingPages.flatMap((response) => response.data),
  ];
}
