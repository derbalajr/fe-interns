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

  const {
    data: lead,
    isLoading,
    isError,
    error,
  } = useLeadQuery(id ?? "");

  if (!id) {
    return (
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Invalid lead ID.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dedede] border-t-[#222222]" />

          <p className="mt-4 text-sm text-[#777777]">
            Loading lead details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="mx-auto w-full max-w-[1180px] space-y-5">
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
          className="inline-flex items-center gap-2 rounded-xl border border-[#dddddd] bg-white px-4 py-2 text-sm font-medium text-[#555555] transition hover:bg-[#f7f7f7]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-6">
      <LeadHeader lead={lead} />

      <LeadPipeline lead={lead} />

      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        <LeadActivityCard lead={lead} />

        <LeadDetailsCard lead={lead} />

        <LeadShortlistCard leadId={lead.id} />
      </div>
    </div>
  );
}