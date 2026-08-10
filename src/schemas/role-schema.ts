import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),

  permissions: z.array(z.string()),
});

export type RolePayload = z.infer<typeof roleSchema>;
