import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { FormDateField } from "@/components/form/FormDateField";
import {
  FormSelectField,
  type SelectOption,
} from "@/components/form/FormSelectField";
import { FormTextField } from "@/components/form/FormTextField";
import { Button } from "@/components/ui/button";
import { useAgentsQuery } from "@/hooks/use-agents-query";
import { useLeadsQuery } from "@/hooks/use-leads-query";
import { useUnitsQuery } from "@/hooks/use-units-query";
import { ApiError } from "@/lib/fetcher";
import {
  dealSchema,
  type DealFormValues,
  type DealPayload,
} from "@/schemas/deal-schema";
import type { Deal } from "@/types/deal";

const stageOptions: SelectOption[] = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

type DealFormProps = {
  deal?: Deal;
  isPending: boolean;
  onSubmit: (data: DealPayload) => Promise<void>;
  onCancel?: () => void;
};

function getDefaultValues(deal?: Deal): DealFormValues {
  return {
    lead_id: deal?.lead_id
      ? String(deal.lead_id)
      : "",

    agent_id: deal?.agent_id
      ? String(deal.agent_id)
      : "",

    unit_id: deal?.unit_id
      ? String(deal.unit_id)
      : "",

    stage: deal?.stage ?? "new",

    value:
      deal?.value == null
        ? ""
        : String(deal.value),

    expected_close:
      deal?.expected_close ?? "",
  };
}

function toPayload(values: DealFormValues): DealPayload {
  return {
    lead_id: Number(values.lead_id),
    agent_id: Number(values.agent_id),
    unit_id: values.unit_id == null ? null : Number(values.unit_id),
    stage: values.stage,
    value: values.value.trim() === "" ? 0 : Number(values.value),
    expected_close:
      values.expected_close === "" ? null : values.expected_close,
  };
}

export function DealForm({
  deal,
  isPending,
  onSubmit,
  onCancel,
}: DealFormProps) {
const methods = useForm({
  resolver: zodResolver(dealSchema),
  defaultValues: getDefaultValues(deal),
});


  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;

  const { data: leadsData } = useLeadsQuery({
    page: 1,
  });

  const { data: agentsData } = useAgentsQuery();

  const { data: unitsData } = useUnitsQuery({
    page: 1,
  });

  useEffect(() => {
    reset(getDefaultValues(deal));
  }, [deal, reset]);

const leadOptions: SelectOption[] =
  leadsData?.data.map((lead) => ({
    label: lead.name,
    value: String(lead.id),
  })) ?? [];

const agentOptions: SelectOption[] =
  agentsData?.map((agent) => ({
    label: agent.name,
    value: String(agent.id),
  })) ?? [];

const unitOptions: SelectOption[] = [
  {
    label: "No Unit",
    value: "",
  },
  ...(unitsData?.data.map((unit) => ({
    label: `${unit.code} (${unit.type})`,
    value: String(unit.id),
  })) ?? []),
];

  const submitForm = handleSubmit(async (values) => {
    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (
            field === "lead_id" ||
            field === "agent_id" ||
            field === "unit_id" ||
            field === "stage" ||
            field === "value" ||
            field === "expected_close"
          ) {
            setError(field as keyof DealFormValues, {
              type: "server",
              message: messages[0] ?? "This field is invalid",
            });
          }
        });

        return;
      }

      setError("root", {
        type: "server",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={submitForm}
        className="space-y-6"
        noValidate
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormSelectField<DealFormValues>
            name="lead_id"
            label="Lead"
            options={leadOptions}
            placeholder="Select a lead"
          />

          <FormSelectField<DealFormValues>
            name="agent_id"
            label="Agent"
            options={agentOptions}
            placeholder="Select an agent"
          />

          <FormSelectField<DealFormValues>
            name="unit_id"
            label="Unit"
            options={unitOptions}
            placeholder="Select a unit"
          />

          <FormSelectField<DealFormValues>
            name="stage"
            label="Stage"
            options={stageOptions}
          />

          <FormTextField<DealFormValues>
            name="value"
            label="Deal Value"
            type="number"
            placeholder="0"
            min={0}
            step="0.01"
          />

          <FormDateField<DealFormValues>
            name="expected_close"
            label="Expected Close Date"
          />
        </div>

        {errors.root?.message && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errors.root.message}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : deal
                ? "Save Changes"
                : "Create Deal"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}