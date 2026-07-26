export type TenantId = "tai" | "marq";

export type TenantConfig = {
  id: TenantId;
  displayName: string;
  shortName: string;
  logoText: string;
  currency: string;
  primaryColor: string;
};

export const TENANT_CONFIGS: Record<TenantId, TenantConfig> = {
  tai: {
    id: "tai",
    displayName: "The Address",
    shortName: "TAI CRM",
    logoText: "TAI",
    currency: "EGP",
    primaryColor: "bg-slate-900",
  },
  marq: {
    id: "marq",
    displayName: "MarQ",
    shortName: "MarQ CRM",
    logoText: "MQ",
    currency: "EGP",
    primaryColor: "bg-slate-900",
  },
};

