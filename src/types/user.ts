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
  // The API returns the primary role as an object ({ id, name }); older/mock
  // data may use a plain string. Support both.
  role?: UserRole | string | Role | null;
  status?: UserStatus | string;
  active?: boolean;
  tenant?: string;
  roles?: string[];
  permissions?: string[];
  roleObj?: Role | null;
  // Not provided by the backend yet — shown as placeholders in the table.
  position?: string;
  phone?: string;
}
