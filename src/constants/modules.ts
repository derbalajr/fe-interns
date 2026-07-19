import type { TenantId } from "./tenants";

export type AppModule = {
  label: string;
  path: string;
  tenants?: TenantId[];
};

export const APP_MODULES: AppModule[] = [
  {
    label: "Dashboard",
    path: "/",
  },
  {
    label: "Customers",
    path: "/customers",
  },
  {
    label: "Reservations",
    path: "/reservations",
    tenants: ["marq"],
  },
];