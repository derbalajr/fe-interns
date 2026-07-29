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
  role?: UserRole | string;
  status?: UserStatus | string;
  active?: boolean;
  tenant?: string;
  roles?: string[];
  permissions?: string[];
  roleObj?: Role | null;
}
