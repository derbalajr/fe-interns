import { apiGet } from "@/lib/fetcher";

import type { LeadsResponse } from "@/types/lead";

export function getLeads(
  page = 1,
  search = "",
  stage = "",
  source = "",
) {
  const params = new URLSearchParams();

  params.set("page", page.toString());

  if (search) {
    params.set("search", search);
  }

  if (stage) {
    params.set("stage", stage);
  }

  if (source) {
    params.set("source", source);
  }

  return apiGet<LeadsResponse>(`/leads?${params.toString()}`);
}