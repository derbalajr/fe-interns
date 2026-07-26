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
    label: "Leads",
    path: "/leads",
    tenants: ["tai"],
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
  {
    label: "Projects",
    path: "/projects",
    tenants: ["marq"],
  },
  {
    label: "Users",
    path: "/users",
  },
];
