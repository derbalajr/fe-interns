import { apiGet, apiPost } from "../lib/fetcher";

import type { LoginCredentials, LoginResponse, User } from "../types/auth";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginCredentials>(
    "/login",
    credentials,
  );
}

export async function getProfile(): Promise<User> {
  const response = await apiGet<any>("/me");

  return response?.data?.id ? response.data : response;
}

export async function logoutRequest(): Promise<void> {
  return apiPost<void>("/logout");
}