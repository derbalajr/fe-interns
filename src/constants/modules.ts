import type { TenantId } from "./tenants";

export type AppModule = {
  label: string;
  path: string;
  tenants?: TenantId[];
  permission?: string;
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
    permission: "view-users",
    tenants: ["marq"],
  },
  {
    label: "Roles",
    path: "/roles",
    permission: "view-roles",
  },
];
