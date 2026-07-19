import { apiGet, apiPost } from "../lib/fetcher";
import type {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
  User,
} from "../types/auth";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginCredentials>(
    "/api/login",
    credentials,
  );
}

export async function getProfile(): Promise<User> {
  const response = await apiGet<ProfileResponse>("/api/user");

  if ("user" in response) {
    return response.user;
  }

  return response;
}

export async function logoutRequest(): Promise<void> {
  await apiPost<void>("/api/logout");
}