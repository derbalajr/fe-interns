import { z } from "zod";

// NOTE: the role <select> is registered with `setValueAs` so an empty option
// arrives here as `undefined` (never NaN), keeping this validation simple.
const baseUserSchema = z.object({
  name: z.string().min(2, "Name is required"),

  email: z.email("Enter a valid email"),

  // On edit the password inputs aren't shown and the fields reset to "".
  // Allow an empty string (meaning "leave unchanged") alongside a valid one.
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .or(z.literal(""))
    .optional(),

  password_confirmation: z.string().optional(),

  role_id: z.number().int().positive().optional(),

  status: z.enum(["Active", "Inactive"]).optional(),

  active: z.boolean().optional(),

  tenant: z.string().optional(),
});

export const createUserSchema = baseUserSchema
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password confirmation is required"),
    role_id: z
      .number({ message: "Role is required" })
      .int()
      .positive("Role is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const updateUserSchema = baseUserSchema.refine(
  // On edit the password is optional; only enforce the match when a new
  // (non-empty) password is actually being set.
  (data) => !data.password || data.password === data.password_confirmation,
  {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  },
);

export const userSchema = baseUserSchema;

export type UserFormValues = z.infer<typeof userSchema>;
