import type { Role } from "../api/roles";

export const mockRoles: Role[] = [
  {
    id: 1,
    name: "admin",
    guard_name: "web",
  },
  {
    id: 2,
    name: "super-admin",
    guard_name: "web",
  },
  {
    id: 3,
    name: "manager",
    guard_name: "web",
  },
  {
    id: 4,
    name: "agent",
    guard_name: "web",
  },
];
