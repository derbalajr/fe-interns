import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { LeadActivityCard } from "@/components/leads/LeadActivityCard";
import { LeadDetailsCard } from "@/components/leads/LeadDetailsCard";
import { LeadHeader } from "@/components/leads/LeadHeader";
import { LeadPipeline } from "@/components/leads/LeadPipeline";
import { LeadShortlistCard } from "@/components/leads/LeadShortlistCard";
import { useLeadQuery } from "@/hooks/use-lead-query";

export function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: lead, isLoading, isError, error } = useLeadQuery(id ?? "");

  if (!id) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Invalid lead ID.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-500">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">Failed to load the lead.</p>

          <p className="mt-1 text-sm">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </p>
        </div>

        <Link
          to="/leads"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-7">
      <LeadHeader lead={lead} />

      <LeadPipeline lead={lead} />
      <div className="grid items-stretch gap-6 xl:grid-cols-3">
        <LeadActivityCard lead={lead} />

        <LeadDetailsCard lead={lead} />

        <LeadShortlistCard />
      </div>
    </div>
  );
}
