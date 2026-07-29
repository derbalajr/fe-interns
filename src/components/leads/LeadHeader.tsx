import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/lead";

type LeadHeaderProps = {
  lead: Lead;
};

function formatValue(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getAiScore(lead: Lead): string {
  if (
    lead.ai_score === null ||
    lead.ai_score === undefined ||
    lead.ai_score === ""
  ) {
    return "—";
  }

  const numericScore = Number(lead.ai_score);

  return Number.isFinite(numericScore)
    ? String(numericScore)
    : "—";
}

export function LeadHeader({ lead }: LeadHeaderProps) {
  const score = getAiScore(lead);

  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <Link
          to="/leads"
          aria-label="Back to leads"
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8d8d8] bg-white text-[#777777] transition hover:border-[#aaaaaa] hover:text-[#222222]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-[30px] font-semibold tracking-[-0.04em] text-[#171717]">
              {lead.name}
            </h1>

            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#e6f8f0] px-3 text-[11px] font-medium text-[#2f8065]">
              <Sparkles className="h-3.5 w-3.5" />

              {score === "—"
                ? "AI Score —"
                : `AI Score ${score}`}
            </span>
          </div>

          <p className="mt-1.5 truncate text-xs text-[#777777]">
            {formatValue(lead.stage)}
            <span className="mx-2">·</span>
            Source: {formatValue(lead.source)}
            <span className="mx-2">·</span>
            Assigned to {lead.agent?.name ?? "Unassigned"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        disabled
        className="h-10 w-full rounded-xl bg-[#242424] px-6 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-[#8d8d95] disabled:opacity-100 lg:w-auto"
      >
        Convert To Deal
      </Button>
    </section>
  );
}