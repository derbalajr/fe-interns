import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),

  email: z.string().trim().email("Enter a valid email address"),

  status: z.enum(["active", "pending", "inactive"], {
    message: "Select a customer status",
  }),

  followUpDate: z.string().min(1, "Select a follow-up date"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
