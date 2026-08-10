import { apiGet } from "@/lib/fetcher";

import type { ClientsResponse } from "@/types/client";

const PER_PAGE = 100;

export function getClients(page = 1) {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("per_page", PER_PAGE.toString());

  return apiGet<ClientsResponse>(`/clients?${params.toString()}`);
}
