import { apiGet, apiPost } from "../lib/fetcher";

import type {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
  User,
} from "../types/auth";

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    "id" in value &&
    "name" in value &&
    "email" in value &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  );
}

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginCredentials>("/login", credentials);
}

export async function getProfile(): Promise<User> {
  const response = await apiGet<ProfileResponse>("/me");

  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    isUser(response.data)
  ) {
    return response.data;
  }

  if (isUser(response)) {
    return response;
  }

  throw new Error("Unexpected profile response shape.");
}

export async function logoutRequest(): Promise<void> {
  return apiPost<void>("/logout");
}
