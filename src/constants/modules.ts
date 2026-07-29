import type { TenantId } from "./tenants";

export type AppModule = {
  label: string;
  path: string;
  tenants?: TenantId[];
  /** When true, the module is hidden from agents (managers/admins only). */
  managerOnly?: boolean;
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
    label: "Deals",
    path: "/deals",
    tenants: ["tai"],
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
    managerOnly: true,
  },
];