import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { FormSelectField } from "@/components/form/FormSelectField";
import { FormTextField } from "@/components/form/FormTextField";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/fetcher";
import {
  LEAD_STAGE_VALUES,
  leadSchema,
  type LeadFormValues,
  type LeadPayload,
} from "@/schemas/lead-schema";
import type { Lead } from "@/types/lead";

const sourceOptions = [
  {
    label: "Website",
    value: "website",
  },
  {
    label: "Referral",
    value: "referral",
  },
  {
    label: "Social Media",
    value: "social_media",
  },
  {
    label: "Phone Call",
    value: "phone_call",
  },
  {
    label: "Walk In",
    value: "walk_in",
  },
];

// Derived from the schema so the form's options can never drift from the
// stages the schema actually accepts.
const stageOptions = LEAD_STAGE_VALUES.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

type LeadFormProps = {
  lead?: Lead;
  isPending: boolean;
  onSubmit: (data: LeadPayload) => Promise<void>;
  onCancel?: () => void;
};

function getDefaultValues(lead?: Lead): LeadFormValues {
  return {
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    source: (lead?.source as LeadFormValues["source"]) ?? "website",
    stage: (lead?.stage as LeadFormValues["stage"]) ?? "new",
    budget: lead?.budget == null ? "" : String(lead.budget),
  };
}

function toPayload(values: LeadFormValues): LeadPayload {
  return {
    name: values.name.trim(),
    email: values.email.trim() === "" ? null : values.email.trim(),
    phone: values.phone.trim() === "" ? null : values.phone.trim(),
    source: values.source,
    stage: values.stage,
    budget: values.budget.trim() === "" ? null : Number(values.budget),
  };
}

export function LeadForm({
  lead,
  isPending,
  onSubmit,
  onCancel,
}: LeadFormProps) {
  const methods = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: getDefaultValues(lead),
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset(getDefaultValues(lead));
  }, [lead, reset]);

  const submitForm = handleSubmit(async (values) => {
    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (
            field === "name" ||
            field === "email" ||
            field === "phone" ||
            field === "source" ||
            field === "stage" ||
            field === "budget"
          ) {
            setError(field, {
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
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={submitForm} className="space-y-6" noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <FormTextField<LeadFormValues>
            name="name"
            label="Name"
            placeholder="Enter lead name"
          />

          <FormTextField<LeadFormValues>
            name="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
          />

          <FormTextField<LeadFormValues>
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+20 100 000 0000"
          />

          <FormTextField<LeadFormValues>
            name="budget"
            label="Budget"
            type="number"
            placeholder="0"
            min={0}
            step="0.01"
          />

          <FormSelectField<LeadFormValues>
            name="source"
            label="Source"
            options={sourceOptions}
          />

          <FormSelectField<LeadFormValues>
            name="stage"
            label="Stage"
            options={stageOptions}
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
            {isPending ? "Saving..." : lead ? "Save Changes" : "Create Lead"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
