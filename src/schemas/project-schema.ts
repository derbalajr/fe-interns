import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name is too long"),

  location: z
    .string()
    .min(2, "Location is required")
    .max(255, "Location is too long"),

  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type ProjectPayload = z.infer<typeof projectSchema>;
