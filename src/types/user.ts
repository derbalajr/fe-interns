export type UserRole = "Manager" | "Agent";

export type UserStatus = "Active" | "Inactive";

export interface Role {
  id: number;
  name: string;
  guard_name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;

  // Populated by the API for the authenticated user; may be absent on other
  // payloads (mock data, list rows), so consumers must null-guard.
  roles?: string[];
  permissions?: string[];
}