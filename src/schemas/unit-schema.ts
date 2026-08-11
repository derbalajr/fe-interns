import { z } from "zod";

// The backend does not accept a status field here; it sets a default value for
// new units and updates status separately. Media is handled in the form as a
// multipart upload payload.
export const unitSchema = z.object({
  project_id: z.coerce
    .number()
    .int()
    .positive("Project is required"),

  code: z
    .string()
    .min(1, "Code is required")
    .max(100, "Code is too long"),

  type: z
    .string()
    .min(1, "Type is required")
    .max(100, "Type is too long"),

  area: z.coerce
    .number()
    .gt(0, "Area must be greater than 0"),

  price: z.coerce
    .number()
    .gt(0, "Price must be greater than 0"),
});

export type UnitFormValues = z.input<typeof unitSchema>;
export type UnitPayload = z.output<typeof unitSchema>;