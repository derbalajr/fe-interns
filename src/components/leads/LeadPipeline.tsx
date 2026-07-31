import { Check } from "lucide-react";

import { AssignAgentDialog } from "@/components/leads/AssignAgentDialog";
import { EditLeadDialog } from "@/components/leads/EditLeadDialog";
import { UpdateStageDialog } from "@/components/leads/UpdateStageDialog";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/lead";

const PIPELINE_STAGES = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "qualified",
    label: "Qualified",
  },
  {
    value: "viewing",
    label: "Viewing",
  },
  {
    value: "negotiation",
    label: "Negotiation",
  },
  {
    value: "won",
    label: "Won",
  },
] as const;

type LeadPipelineProps = {
  lead: Lead;
};

function getStageIndex(stage?: string | null): number {
  if (!stage) {
    return -1;
  }

  const normalizedStage = stage.trim().toLowerCase();

  return PIPELINE_STAGES.findIndex(
    (pipelineStage) =>
      pipelineStage.value === normalizedStage,
  );
}

export function LeadPipeline({ lead }: LeadPipelineProps) {
  const currentStage = lead.stage;
  const currentStageIndex = getStageIndex(currentStage);
  const isUnqualified = currentStage === "unqualified";

  const visualStageIndex = isUnqualified
    ? -1
    : currentStageIndex;

  return (
    <section className="rounded-2xl border border-[#e7e7e7] bg-[#fbfbfb] px-7 py-6 shadow-[0_2px_7px_rgba(0,0,0,0.035)]">
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[820px]">
          <div className="relative">
            <div className="absolute left-[4.5%] right-[4.5%] top-[18px] border-t border-dashed border-[#a9a9a9]" />

            {visualStageIndex > 0 && (
              <div
                className="absolute left-[4.5%] top-[18px] border-t border-solid border-[#171717]"
                style={{
                  width: `${
                    (visualStageIndex /
                      (PIPELINE_STAGES.length - 1)) *
                    91
                  }%`,
                }}
              />
            )}

            <div className="relative grid grid-cols-6">
              {PIPELINE_STAGES.map((stage, index) => {
                const isCompleted =
                  visualStageIndex >= 0 &&
                  index < visualStageIndex;

                const isCurrent =
                  visualStageIndex >= 0 &&
                  index === visualStageIndex;

                return (
                  <div
                    key={stage.value}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={[
                        "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border transition",
                        isCompleted
                          ? "border-[#111111] bg-[#111111] text-white"
                          : "",
                        isCurrent
                          ? "border-2 border-[#111111] bg-white text-[#111111]"
                          : "",
                        !isCompleted && !isCurrent
                          ? "border-[#c9c9c9] bg-[#e5e3e3] text-[#999999]"
                          : "",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : null}
                    </div>

                    <p
                      className={[
                        "mt-2.5 text-[11px] font-medium",
                        isCompleted || isCurrent
                          ? "text-[#242424]"
                          : "text-[#555555]",
                      ].join(" ")}
                    >
                      {stage.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isUnqualified && (
        <div className="mt-4 rounded-xl border border-[#f4cccc] bg-[#fff2f2] px-4 py-3 text-xs font-medium text-[#a84444]">
          This lead has been marked as unqualified.
        </div>
      )}

      {!isUnqualified && currentStageIndex === -1 && (
        <p className="mt-4 text-xs text-[#9a6c22]">
          {currentStage
            ? `The current stage “${currentStage}” is not supported by this pipeline.`
            : "This lead does not have a stage yet."}
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-2">
        <UpdateStageDialog lead={lead} />

        <AssignAgentDialog lead={lead} />

        <EditLeadDialog lead={lead} />

        <Button
          type="button"
          variant="outline"
          disabled
          className="h-9 rounded-xl border-[#e2e2e2] bg-white px-4 text-xs font-medium text-[#999999] shadow-[0_2px_6px_rgba(0,0,0,0.035)] disabled:opacity-100"
        >
          Log Activity
        </Button>
      </div>
    </section>
  );
}