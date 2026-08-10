import { useProfileQuery } from "./use-profile-query";

export function useCan() {
  const profileQuery = useProfileQuery();

  // getProfile() already unwraps the { data, meta } envelope and resolves to a
  // User, so the query data IS the user — don't reach into `.data` again.
  const user = profileQuery.data;

  function can(permission: string): boolean {
    return user?.permissions?.includes(permission) ?? false;
  }

  function hasRole(role: string): boolean {
    return user?.roles?.includes(role) ?? false;
  }

  return {
    can,
    hasRole,
    user,
    isLoading: profileQuery.isPending,
  };
}