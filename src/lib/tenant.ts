import {
  TENANT_CONFIGS,
  type TenantConfig,
  type TenantId,
} from "../constants/tenants";

function normalizeTenantId(tenantId?: string | null): TenantId | null {
  const normalizedTenantId = tenantId?.trim().toLowerCase();

  if (!normalizedTenantId || !(normalizedTenantId in TENANT_CONFIGS)) {
    return null;
  }

  return normalizedTenantId as TenantId;
}

export function getCurrentTenant(
  tenantId?: string | null,
): TenantConfig | null {
  const resolvedTenantId = normalizeTenantId(tenantId);

  return resolvedTenantId ? TENANT_CONFIGS[resolvedTenantId] : null;
}
