import { useMemo } from "react";

import { useTenant } from "@/hooks/use-tenant";
import type { Lead } from "@/types/lead";

import { LeadPanel } from "./LeadPanel";

type LeadDetailsCardProps = {
  lead: Lead;
};

type DetailRowProps = {
  label: string;
  value: string;
  href?: string;
};

function DetailRow({ label, value, href }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-4 border-b border-slate-200 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <dt className="text-sm text-slate-500">{label}</dt>

      <dd className="min-w-0 text-sm font-medium text-slate-900">
        {href ? (
          <a href={href} className="break-words hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function LeadDetailsCard({ lead }: LeadDetailsCardProps) {
  const { tenant } = useTenant();

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-EG", {
        style: "currency",
        currency: tenant?.currency ?? "EGP",
        maximumFractionDigits: 0,
      }),
    [tenant?.currency],
  );

  const numericBudget =
    lead.budget == null ? null : Number(lead.budget);

  const formattedBudget =
    numericBudget === null || !Number.isFinite(numericBudget)
      ? "Not specified"
      : currencyFormatter.format(numericBudget);

  const formattedDate = new Date(lead.created_at).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <LeadPanel title="Details" className="h-full">
      <dl>
        <DetailRow
          label="Phone"
          value={lead.phone || "Not specified"}
          href={lead.phone ? `tel:${lead.phone}` : undefined}
        />

        <DetailRow
          label="Email"
          value={lead.email}
          href={`mailto:${lead.email}`}
        />

        <DetailRow
          label="Source"
          value={lead.source || "Not specified"}
        />

        <DetailRow
          label="Budget"
          value={formattedBudget}
        />

        <DetailRow
          label="Stage"
          value={lead.stage}
        />

        <DetailRow
          label="Created"
          value={formattedDate}
        />
      </dl>
    </LeadPanel>
  );
}