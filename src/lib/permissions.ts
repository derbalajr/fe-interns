import type { User } from "@/types/auth";

/**
 * Role helpers for the logged-in (auth) user.
 *
 * The backend returns roles as a string[] (Laravel/Spatie style). We match
 * against the exact role names the backend seeds (`agent`, `manager`,
 * `admin`, `super-admin`) rather than loose patterns, so a "supervisor" or a
 * role that merely contains "admin" as a substring is never mistaken for an
 * elevated role.
 *
 * Access guards default to *deny*: a user with no roles, or an unrecognized
 * role, is not treated as privileged.
 */
const MANAGER_ROLES = new Set(["manager", "admin", "super-admin", "owner"]);
const AGENT_ROLES = new Set(["agent"]);

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

export function isManager(user: User | null | undefined): boolean {
  const roles = user?.roles ?? [];
  return roles.some((role) => MANAGER_ROLES.has(normalizeRole(role)));
}

export function isAgent(user: User | null | undefined): boolean {
  const roles = user?.roles ?? [];

  if (roles.some((role) => MANAGER_ROLES.has(normalizeRole(role)))) {
    return false;
  }

  return roles.some((role) => AGENT_ROLES.has(normalizeRole(role)));
}

/**
 * Only managers/admins may view and edit the Users directory.
 * Defaults to deny for unknown/roleless users.
 */
export function canManageUsers(user: User | null | undefined): boolean {
  return isManager(user);
}
