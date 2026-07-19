import type {
  LoginCredentials,
  LoginResponse,
  User,
} from "../types/auth";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return Promise.resolve({
    token: "dummy-token",
    user: {
      id: 1,
      name: "Salma",
      email: credentials.email,
    },
  });
}

export async function getProfile(): Promise<User> {
  return Promise.resolve({
    id: 1,
    name: "Salma",
    email: "user@gmail.com",
  });
}

export async function logoutRequest(): Promise<void> {
  return Promise.resolve();
}