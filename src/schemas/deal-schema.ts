import { z } from "zod";

export const DEAL_STAGE_VALUES = [
  "new",
  "contacted",
  "qualified",
  "negotiation",
  "won",
  "lost",
] as const;

export type DealStage =
  (typeof DEAL_STAGE_VALUES)[number];

export const dealSchema = z.object({
  lead_id: z.preprocess(
    (value) =>
      value === "" || value == null
        ? undefined
        : Number(value),
    z.number({
      message: "Select a lead",
    }),
  ),

  unit_id: z.preprocess(
    (value) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return null;
      }

      return Number(value);
    },
    z.number().nullable(),
  ),

  agent_id: z.preprocess(
    (value) =>
      value === "" || value == null
        ? undefined
        : Number(value),
    z.number({
      message: "Select an agent",
    }),
  ),

  stage: z.enum(DEAL_STAGE_VALUES, {
    message: "Select a stage",
  }),

  value: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        (!Number.isNaN(Number(value)) &&
          Number(value) >= 0),
      "Value must be zero or greater",
    ),

  expected_close: z
    .string()
    .nullable(),
});

export type DealFormValues = z.input<
  typeof dealSchema
>;

export type DealPayload = {
  lead_id: number;
  unit_id: number | null;
  agent_id: number;
  stage: DealStage;
  value: number;
  expected_close: string | null;
};