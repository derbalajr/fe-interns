import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),

  email: z.email("Enter a valid email"),

  role: z.enum(["Manager", "Agent"]),

  status: z.enum(["Active", "Inactive"]),
});

export type UserFormValues = z.infer<typeof userSchema>;