import { useAuth } from "@/context/AuthContext";
import { TENANT_CONFIGS, type TenantId } from "@/constants/tenants";

export function useTenant() {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return { tenant: null, isLoadingTenant: true };
  }

  if (!user?.tenant) {
    return { tenant: null, isLoadingTenant: false };
  }

  // Direct lookup using "tai" or "marq" from user.tenant
  const tenantKey = user.tenant as TenantId;
  const tenantConfig = TENANT_CONFIGS[tenantKey] ?? null;

  return { tenant: tenantConfig, isLoadingTenant: false };
}
