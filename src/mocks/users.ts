import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Salma Walid",
    email: "salma@crm.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    email: "ahmed@crm.com",
    role: "Agent",
    status: "Active",
  },
  {
    id: 3,
    name: "Mariam Ali",
    email: "mariam@crm.com",
    role: "Agent",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Omar Khaled",
    email: "omar@crm.com",
    role: "Agent",
    status: "Active",
  },
];
