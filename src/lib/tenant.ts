import {
  TENANT_CONFIGS,
  type TenantConfig,
  type TenantId,
} from "../constants/tenants";

export function getCurrentTenant(): TenantConfig {
  const tenantId = import.meta.env.VITE_TENANT_ID as TenantId;

  if (!tenantId || !(tenantId in TENANT_CONFIGS)) {
    throw new Error(
      `Invalid VITE_TENANT_ID: ${tenantId}`,
    );
  }

  return TENANT_CONFIGS[tenantId];
}