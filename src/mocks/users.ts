import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Salma Walid",
    email: "salma@crm.com",
    role: "Manager",
    status: "Active",
    roles: ["manager"],
    permissions: [],
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    email: "ahmed@crm.com",
    role: "Agent",
    status: "Active",
    roles: ["agent"],
    permissions: [],
  },
  {
    id: 3,
    name: "Mariam Ali",
    email: "mariam@crm.com",
    role: "Agent",
    status: "Inactive",
    roles: ["agent"],
    permissions: [],
  },
  {
    id: 4,
    name: "Omar Khaled",
    email: "omar@crm.com",
    role: "Agent",
    status: "Active",
    roles: ["agent"],
    permissions: [],
  },
];
