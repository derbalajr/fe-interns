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

function DetailRow({
  label,
  value,
  href,
}: DetailRowProps) {
  return (
    <div className="grid grid-cols-[70px_minmax(0,1fr)] gap-4 border-b border-[#ededed] py-3 first:pt-0 last:border-b-0 last:pb-0">
      <dt className="text-[10px] text-[#777777]">
        {label}:
      </dt>

      <dd className="min-w-0 text-[10px] font-medium text-[#303030]">
        {href ? (
          <a
            href={href}
            className="break-words hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function formatValue(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function LeadDetailsCard({
  lead,
}: LeadDetailsCardProps) {
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
    lead.budget == null
      ? null
      : Number(lead.budget);

  const formattedBudget =
    numericBudget === null ||
    !Number.isFinite(numericBudget)
      ? "Not specified"
      : currencyFormatter.format(numericBudget);

  const formattedDate = new Date(
    lead.created_at,
  ).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <LeadPanel title="Details" className="h-full">
      <dl>
        <DetailRow
          label="Phone"
          value={lead.phone || "Not specified"}
          href={
            lead.phone
              ? `tel:${lead.phone}`
              : undefined
          }
        />

        <DetailRow
          label="Email"
          value={lead.email}
          href={`mailto:${lead.email}`}
        />

        <DetailRow
          label="Source"
          value={formatValue(lead.source)}
        />

        <DetailRow
          label="Budget"
          value={formattedBudget}
        />

        <DetailRow
          label="Stage"
          value={formatValue(lead.stage)}
        />

        <DetailRow
          label="Created"
          value={formattedDate}
        />
      </dl>
    </LeadPanel>
  );
}