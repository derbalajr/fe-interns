export type CustomerStatus =
  | "active"
  | "pending"
  | "inactive";

export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
};