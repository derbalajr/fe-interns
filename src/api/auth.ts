import { apiGet, apiPost } from "../lib/fetcher";

import type { LoginCredentials, LoginResponse, ProfileResponse, User } from "../types/auth";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginCredentials>(
    "/login",
    credentials,
  );
}

export async function getProfile(): Promise<User> {
  const response = await apiGet<ProfileResponse>("/me");

  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data &&
    typeof response.data === "object" &&
    "id" in response.data
  ) {
    return response.data;
  }

  if (response && typeof response === "object" && "id" in response) {
    return response;
  }

  throw new Error("Unexpected profile response shape.");
}

export async function logoutRequest(): Promise<void> {
  return apiPost<void>("/logout");
}