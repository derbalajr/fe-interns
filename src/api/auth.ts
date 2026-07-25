import { apiGet, apiPost } from "../lib/fetcher";

import type { LoginCredentials, LoginResponse, User } from "../types/auth";
import type { ProfileResponse } from "../types/auth";
export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginCredentials>(
    "/login",
    credentials,
  );
}

export async function getProfile(): Promise<ProfileResponse> {
  return apiGet<ProfileResponse>("/me");
}

export async function logoutRequest(): Promise<void> {
  return apiPost<void>("/logout");
}