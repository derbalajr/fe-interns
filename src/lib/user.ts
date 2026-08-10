import type { User, UserStatus } from "@/types/user";

/** Primary role display name, tolerant of string | { name } | roleObj shapes. */
export function getUserRoleName(user: User): string {
  if (typeof user.role === "string") {
    return user.role;
  }

  if (user.role && typeof user.role === "object" && "name" in user.role) {
    return user.role.name;
  }

  return user.roleObj?.name ?? "";
}

/** Primary role id, used to preselect the role in the edit form. */
export function getUserRoleId(user: User): number | undefined {
  if (user.role && typeof user.role === "object" && "id" in user.role) {
    return user.role.id;
  }

  return user.roleObj?.id;
}

/** Normalised status, derived from the `active` boolean when needed. */
export function getUserStatus(user: User): UserStatus {
  if (user.status === "Active" || user.status === "Inactive") {
    return user.status;
  }

  return user.active ? "Active" : "Inactive";
}
