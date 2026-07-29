import { apiGet } from "@/lib/fetcher";

export type Role = {
  id: number;
  name: string;
  guard_name: string;
};

export async function getRoles(): Promise<Role[]> {
  const response = await apiGet<Role[] | { data: Role[] }>("/roles");
  // Handle both wrapped and unwrapped responses
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response as Role[];
}
