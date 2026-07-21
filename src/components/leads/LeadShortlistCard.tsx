import { Building2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { LeadPanel } from "./LeadPanel";

export function LeadShortlistCard() {
  return (
    <LeadPanel
      title="Shortlisted Units"
      className="h-full"
      action={
        <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-medium text-slate-600">
          Inventory
        </span>
      }
    >
      <div className="flex min-h-56 flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Building2 className="h-6 w-6" />
        </div>

        <h3 className="mt-4 font-medium text-slate-900">
          No shortlisted units
        </h3>

        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Shortlisted units will appear here once the shortlist API is
          connected.
        </p>

        <Button
          type="button"
          variant="outline"
          disabled
          className="mt-6 rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Unit to Shortlist
        </Button>
      </div>
    </LeadPanel>
  );
}
