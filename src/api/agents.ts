import { apiGet } from "@/lib/fetcher";
import type { UsersResponse } from "@/types/assignable-user";

export function getAssignableAgents() {
  return apiGet<UsersResponse>("/users?per_page=100");
}
