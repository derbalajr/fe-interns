import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/lead";

type LeadHeaderProps = {
  lead: Lead;
};

export function LeadHeader({ lead }: LeadHeaderProps) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <Link
          to="/leads"
          aria-label="Back to leads"
          className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {lead.name}
            </h1>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI Score —
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {lead.stage}
            <span className="mx-2">·</span>
            Source: {lead.source || "Not specified"}
            <span className="mx-2">·</span>
            Assigned to {lead.agent?.name ?? "Unassigned"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        disabled
        className="w-full rounded-xl bg-slate-950 px-6 text-white lg:w-auto"
      >
        Convert to Deal
      </Button>
    </section>
  );
}
