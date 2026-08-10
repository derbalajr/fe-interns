import { z } from "zod";

// `status` is intentionally absent: the backend prohibits it on create and
// defaults new units to "available". Media is not collected here either.
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

  area: z.coerce.number().gt(0, "Area must be greater than 0"),

  price: z.coerce.number().min(0, "Price must be 0 or more"),
});

// Raw form values (before coercion) vs. the validated/coerced payload.
export type UnitFormValues = z.input<typeof unitSchema>;
export type UnitPayload = z.output<typeof unitSchema>;
