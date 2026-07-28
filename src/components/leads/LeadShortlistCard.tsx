import { useMemo } from "react";
import { Building2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLeadShortlistQuery } from "@/hooks/use-lead-shortlist-query";
import { useRemoveShortlistUnitMutation } from "@/hooks/use-remove-shortlist-unit-mutation";
import { useTenant } from "@/hooks/use-tenant";
import type { Unit } from "@/types/unit";

import { AddShortlistUnitDialog } from "./AddShortlistUnitDialog";
import { LeadPanel } from "./LeadPanel";

type LeadShortlistCardProps = {
  leadId: number;
};

function getProjectName(unit: Unit) {
  return (
    unit.project?.name ?? unit.project?.title ?? `Project ${unit.project_id}`
  );
}

export function LeadShortlistCard({ leadId }: LeadShortlistCardProps) {
  const { tenant } = useTenant();

  const shortlistQuery = useLeadShortlistQuery(leadId);
  const removeMutation = useRemoveShortlistUnitMutation();

  const units = shortlistQuery.data ?? [];

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: tenant?.currency ?? "USD",
        maximumFractionDigits: 0,
      }),
    [tenant?.currency],
  );

  const handleRemove = async (unitId: number) => {
    await removeMutation.mutateAsync({
      leadId,
      unitId,
    });
  };

  return (
    <LeadPanel
      title="Shortlisted Units"
      className="h-full"
      action={
        <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-slate-600">
          {units.length} {units.length === 1 ? "unit" : "units"}
        </span>
      }
    >
      {shortlistQuery.isLoading ? (
        <div className="flex min-h-56 items-center justify-center">
          <p className="text-sm text-slate-500">Loading shortlist...</p>
        </div>
      ) : shortlistQuery.isError ? (
        <div className="min-h-56">
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {shortlistQuery.error instanceof Error
              ? shortlistQuery.error.message
              : "Failed to load the shortlist."}
          </p>
        </div>
      ) : units.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Building2 className="h-6 w-6" />
          </div>

          <h3 className="mt-4 font-medium text-slate-900">
            No shortlisted units
          </h3>

          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Add suitable inventory units to this lead&apos;s shortlist.
          </p>

          <div className="mt-6">
            <AddShortlistUnitDialog leadId={leadId} shortlistedUnits={units} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {units.map((unit) => {
              const isRemoving =
                removeMutation.isPending &&
                removeMutation.variables?.unitId === unit.id;

              return (
                <div
                  key={unit.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{unit.code}</p>

                      <p className="mt-1 text-sm text-slate-500">
                        {getProjectName(unit)} · {unit.type}
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={removeMutation.isPending}
                      aria-label={`Remove unit ${unit.code}`}
                      onClick={() => handleRemove(unit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Area</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {unit.area} m²
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Price</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {currencyFormatter.format(unit.price)}
                      </p>
                    </div>
                  </div>

                  {isRemoving && (
                    <p className="mt-3 text-xs text-slate-500">Removing...</p>
                  )}
                </div>
              );
            })}
          </div>

          {removeMutation.isError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {removeMutation.error instanceof Error
                ? removeMutation.error.message
                : "Failed to remove the unit."}
            </p>
          )}

          <AddShortlistUnitDialog leadId={leadId} shortlistedUnits={units} />
        </div>
      )}
    </LeadPanel>
  );
}
