import type { User } from "@/types/auth";

/**
 * Role helpers for the logged-in (auth) user.
 *
 * The backend returns roles as a free-form string[] (Laravel/Spatie style),
 * so we match by pattern rather than an exact enum. A user counts as a
 * "manager" if they hold any elevated role; they count as an "agent" only
 * when their roles are agent-level *without* any elevated role.
 *
 * Users with no roles at all (e.g. the seeded dummy user) are treated as
 * privileged so we never accidentally lock an admin out of their own tools.
 */
const MANAGER_ROLE_PATTERN = /manager|admin|owner|super/i;
const AGENT_ROLE_PATTERN = /agent/i;

export function isManager(user: User | null | undefined): boolean {
  const roles = user?.roles ?? [];
  return roles.some((role) => MANAGER_ROLE_PATTERN.test(role));
}

export function isAgent(user: User | null | undefined): boolean {
  const roles = user?.roles ?? [];

  if (roles.some((role) => MANAGER_ROLE_PATTERN.test(role))) {
    return false;
  }

  return roles.some((role) => AGENT_ROLE_PATTERN.test(role));
}

/** Only managers/admins may view and edit the Users directory. */
export function canManageUsers(user: User | null | undefined): boolean {
  return !isAgent(user);
}
