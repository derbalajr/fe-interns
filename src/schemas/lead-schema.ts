import { z } from "zod";

export const LEAD_SOURCE_VALUES = [
  "website",
  "referral",
  "social_media",
  "phone_call",
  "walk_in",
] as const;

export const LEAD_STAGE_VALUES = [
  "new",
  "contacted",
  "qualified",
  "negotiation",
  "won",
  "lost",
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters"),

  email: z
    .string()
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Enter a valid email",
    ),

  phone: z.string().trim().max(50, "Phone must not exceed 50 characters"),

  source: z.enum(LEAD_SOURCE_VALUES, {
    message: "Select a source",
  }),

  stage: z.enum(LEAD_STAGE_VALUES, {
    message: "Select a stage",
  }),

  budget: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      "Budget must be zero or greater",
    ),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export type LeadPayload = {
  name: string;
  email: string | null;
  phone: string | null;
  source: LeadFormValues["source"];
  stage: LeadFormValues["stage"];
  budget: number | null;
};
