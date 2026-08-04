import { useProfileQuery } from "./use-profile-query";

export function useCan() {
  const profileQuery = useProfileQuery();

  const user = profileQuery.data?.data;

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