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
  return apiGet<User>("/me");
}

export async function logoutRequest(): Promise<void> {
  return apiPost<void>("/logout");
}