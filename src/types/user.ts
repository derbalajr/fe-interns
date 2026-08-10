export type UserRole = "Manager" | "Agent";

export type UserStatus = "Active" | "Inactive";

// The `Role` entity lives in `@/types/role` (the richer definition used across
// the app); import it from there rather than redefining it here.

/**
 * A role as it can arrive embedded on a user payload: either a plain name
 * string ("Manager", "agent", …) or a `{ id, name }` object. The helpers in
 * `@/lib/user` normalise both shapes.
 */
export interface UserRoleObject {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;

  // The backend is inconsistent about the primary role: it may be a display
  // string (incl. the legacy "Manager"/"Agent" values) or an embedded
  // `{ id, name }` object. Some payloads instead carry it under `roleObj`.
  role: UserRole | string | UserRoleObject;
  roleObj?: UserRoleObject;

  // Status may arrive normalised, or only as an `active` boolean we derive from.
  status?: UserStatus;
  active?: boolean;

  // Optional profile fields shown in the Users directory; absent on some rows.
  position?: string;
  phone?: string;

  // Populated by the API for the authenticated user; may be absent on other
  // payloads (mock data, list rows), so consumers must null-guard.
  roles?: string[];
  permissions?: string[];
}