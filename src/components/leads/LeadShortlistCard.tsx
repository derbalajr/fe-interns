import { useMemo } from "react";
import {
  Building2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLeadShortlistQuery } from "@/hooks/use-lead-shortlist-query";
import { useRemoveShortlistUnitMutation } from "@/hooks/use-remove-shortlist-unit-mutation";
import { useTenant } from "@/hooks/use-tenant";
import { getProjectName } from "@/utils/unit";

import { AddShortlistUnitDialog } from "./AddShortlistUnitDialog";
import { LeadPanel } from "./LeadPanel";

type LeadShortlistCardProps = {
  leadId: number;
};

function getStatusClassName(status: string): string {
  switch (status) {
    case "available":
      return "bg-[#e7f8f1] text-[#34866b]";

    case "reserved":
      return "bg-[#fff3dc] text-[#8a7339]";

    case "sold":
      return "bg-[#fde9e9] text-[#a44848]";

    default:
      return "bg-[#f0f0f0] text-[#666666]";
  }
}

function formatStatus(status: string): string {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

export function LeadShortlistCard({
  leadId,
}: LeadShortlistCardProps) {
  const { tenant } = useTenant();

  const shortlistQuery =
    useLeadShortlistQuery(leadId);

  const removeMutation =
    useRemoveShortlistUnitMutation();

  const units = shortlistQuery.data ?? [];

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: tenant?.currency ?? "EGP",
        maximumFractionDigits: 0,
      }),
    [tenant?.currency],
  );

  const handleRemove = (unitId: number) => {
    removeMutation.mutate({
      leadId,
      unitId,
    });
  };

  return (
    <LeadPanel
      title="Shortlisted Units"
      className="h-full"
      action={
        <span className="rounded-full bg-[#ece9e1] px-3 py-1 text-[10px] font-medium text-[#69645c]">
          {units.length}{" "}
          {units.length === 1 ? "unit" : "units"}
        </span>
      }
    >
      {shortlistQuery.isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <p className="text-xs text-[#777777]">
            Loading shortlist...
          </p>
        </div>
      ) : shortlistQuery.isError ? (
        <div className="min-h-48">
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {shortlistQuery.error instanceof Error
              ? shortlistQuery.error.message
              : "Failed to load the shortlist."}
          </p>
        </div>
      ) : units.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2f2f2] text-[#777777]">
            <Building2 className="h-5 w-5" />
          </div>

          <p className="mt-3 text-xs font-medium text-[#333333]">
            No shortlisted units
          </p>

          <p className="mt-1 max-w-[220px] text-[10px] text-[#858585]">
            Add suitable inventory units to this
            lead&apos;s shortlist.
          </p>

          <div className="mt-4">
            <AddShortlistUnitDialog
              leadId={leadId}
              shortlistedUnits={units}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            {units.map((unit) => {
              const isRemoving =
                removeMutation.isPending &&
                removeMutation.variables
                  ?.unitId === unit.id;

              const numericArea =
                Number(unit.area);

              const numericPrice =
                Number(unit.price);

              return (
                <div
                  key={unit.id}
                  className="group flex items-center gap-3"
                >
                  <div className="flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#cdc7b8] via-[#ede9df] to-[#9da8a1]">
                    <Building2 className="h-5 w-5 text-white/90" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium text-[#333333]">
                          {getProjectName(unit)} ·{" "}
                          {unit.code}
                        </p>

                        <p className="mt-1 truncate text-[9px] text-[#777777]">
                          {unit.type}
                          {Number.isFinite(numericArea)
                            ? ` · ${numericArea.toLocaleString()} M²`
                            : ""}
                          {Number.isFinite(numericPrice)
                            ? ` · ${currencyFormatter.format(numericPrice)}`
                            : ""}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-medium ${getStatusClassName(
                          unit.status,
                        )}`}
                      >
                        {formatStatus(unit.status)}
                      </span>
                    </div>

                    <div className="mt-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isRemoving}
                        aria-label={`Remove unit ${unit.code}`}
                        onClick={() =>
                          handleRemove(unit.id)
                        }
                        className="h-6 w-6 text-[#999999] opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {removeMutation.isError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              {removeMutation.error instanceof Error
                ? removeMutation.error.message
                : "Failed to remove the unit."}
            </p>
          )}

          <div className="mt-5">
            <AddShortlistUnitDialog
              leadId={leadId}
              shortlistedUnits={units}
            />
          </div>
        </div>
      )}
    </LeadPanel>
  );
}