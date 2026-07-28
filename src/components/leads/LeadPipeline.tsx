import { Check } from "lucide-react";

import { AssignAgentDialog } from "@/components/leads/AssignAgentDialog";
import { EditLeadDialog } from "@/components/leads/EditLeadDialog";
import { UpdateStageDialog } from "@/components/leads/UpdateStageDialog";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/lead";

const PIPELINE_STAGES = [
  "New",
  "Contacted",
  "Qualified",
] as const;

type LeadPipelineProps = {
  lead: Lead;
};

function getStageIndex(stage?: string | null) {
  if (!stage) {
    return -1;
  }

  const normalizedStage = stage.trim().toLowerCase();

  return PIPELINE_STAGES.findIndex(
    (pipelineStage) =>
      pipelineStage.toLowerCase() === normalizedStage,
  );
}

export function LeadPipeline({ lead }: LeadPipelineProps) {
  const currentStage = lead.stage;
  const currentStageIndex = getStageIndex(currentStage);
  const isUnqualified = currentStage === "unqualified";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <div className="overflow-x-auto pb-3">
        <div className="min-w-[520px]">
          <div className="relative">
            <div className="absolute left-[8%] right-[8%] top-6 h-px border-t border-dashed border-slate-400" />

            {currentStageIndex > 0 && (
              <div
                className="absolute left-[8%] top-6 h-px border-t border-solid border-slate-800"
                style={{
                  width: `${
                    (currentStageIndex / (PIPELINE_STAGES.length - 1)) * 84
                  }%`,
                }}
              />
            )}

            <div className="relative grid grid-cols-3">
              {PIPELINE_STAGES.map((stage, index) => {
                const isCompleted =
                  currentStageIndex >= 0 && index < currentStageIndex;

                const isCurrent =
                  currentStageIndex >= 0 && index === currentStageIndex;

                return (
                  <div
                    key={stage}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={[
                        "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition",
                        isCompleted
                          ? "border-slate-950 bg-slate-950 text-white shadow-md"
                          : "",
                        isCurrent
                          ? "border-slate-950 bg-white text-slate-950 shadow-md"
                          : "",
                        !isCompleted && !isCurrent
                          ? "border-slate-300 bg-slate-200 text-slate-400"
                          : "",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : null}
                    </div>

                    <p
                      className={[
                        "mt-3 text-sm font-medium",
                        isCompleted || isCurrent
                          ? "text-slate-950"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {stage}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isUnqualified && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          This lead has been marked as unqualified.
        </div>
      )}

      {!isUnqualified && currentStageIndex === -1 && (
        <p className="mt-2 text-sm text-amber-700">
          {currentStage
            ? `The current stage “${currentStage}” is not supported by the pipeline.`
            : "This lead does not have a stage yet."}
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        <UpdateStageDialog lead={lead} />

        <AssignAgentDialog lead={lead} />

        <EditLeadDialog lead={lead} />

        <Button
          type="button"
          variant="outline"
          disabled
          className="rounded-xl"
        >
          Log Activity
        </Button>
      </div>
    </section>
  );
}