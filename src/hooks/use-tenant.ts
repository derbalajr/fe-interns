import { useMemo } from "react";

import { useAuth } from "@/context/AuthContext";
import { getCurrentTenant } from "@/lib/tenant";

export function useTenant() {
  const { user, isLoadingUser } = useAuth();

  return useMemo(() => {
    if (isLoadingUser) {
      return { tenant: null, isLoadingTenant: true };
    }

    const tenant = getCurrentTenant(user?.tenant);
    return { tenant, isLoadingTenant: false };
  }, [isLoadingUser, user?.tenant]);
}
