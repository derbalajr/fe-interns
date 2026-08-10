import { apiGet } from "@/lib/fetcher";
import type { Role } from "@/types/user";

// Single canonical definition lives in `@/types/user`; re-exported here so
// existing imports from `@/api/roles` keep working.
export type { Role };

export async function getRoles(): Promise<Role[]> {
  const response = await apiGet<Role[] | { data: Role[] }>("/roles");
  // Handle both wrapped and unwrapped responses
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response as Role[];
}
