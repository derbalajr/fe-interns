import { apiGet, apiPost, apiPut } from "@/lib/fetcher";
import type { User } from "../types/user";
import type { UserFormValues } from "../schemas/user-schema";

export async function getUsers(): Promise<User[]> {
  const response = await apiGet<User[] | { data: User[] }>("/users");
  // Handle both wrapped and unwrapped responses
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response as User[];
}

export async function createUser(data: UserFormValues): Promise<User> {
  return apiPost<User, UserFormValues>("/users", data);
}

export async function updateUser(
  id: number,
  data: UserFormValues,
): Promise<User> {
  // Remove password fields from update if they're empty
  const updateData = {
    ...data,
    ...(data.password === "" && { password: undefined }),
    ...(data.password_confirmation === "" && { password_confirmation: undefined }),
  };
  return apiPut<User, Partial<UserFormValues>>(`/users/${id}`, updateData);
}
