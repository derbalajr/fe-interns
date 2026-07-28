import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChangeLeadStage } from "@/hooks/use-change-lead-stage";
import type { LeadFormValues } from "@/schemas/lead-schema";
import type { Lead } from "@/types/lead";

const stageLabels: Record<string, string> = {
  contacted: "Contacted",
  qualified: "Qualified",
  unqualified: "Unqualified",
};

const allowedTransitions: Record<string, LeadFormValues["stage"][]> = {
  new: ["contacted"],
  contacted: ["qualified", "unqualified"],
  qualified: ["unqualified"],
  unqualified: [],
};

type UpdateStageDialogProps = {
  lead: Lead;
};

export function UpdateStageDialog({ lead }: UpdateStageDialogProps) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<LeadFormValues["stage"] | "">("");

  const changeStageMutation = useChangeLeadStage();

  const availableStages = allowedTransitions[lead.stage] ?? [];

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setStage("");
      changeStageMutation.reset();
    }
  };

  const handleSubmit = async () => {
    if (!stage) {
      return;
    }

    try {
      await changeStageMutation.mutateAsync({
        leadId: lead.id,
        data: {
          stage,
        },
      });

      setOpen(false);
    } catch {
      // The mutation error is rendered inside the dialog.
    }
  };

  const errorMessage =
    changeStageMutation.error instanceof Error
      ? changeStageMutation.error.message
      : null;

  const hasAvailableTransitions = availableStages.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            className="rounded-xl"
            disabled={!hasAvailableTransitions}
          >
            Change Stage
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Lead Stage</DialogTitle>

          <DialogDescription>
            Update the pipeline stage for {lead.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {hasAvailableTransitions ? (
            <div className="space-y-2">
              <label htmlFor="lead-stage" className="text-sm font-medium">
                Stage
              </label>

              <Select
                value={stage}
                onValueChange={(value) =>
                  setStage(value as LeadFormValues["stage"])
                }
                disabled={changeStageMutation.isPending}
              >
                <SelectTrigger id="lead-stage">
                  <SelectValue placeholder="Select the next stage" />
                </SelectTrigger>

                <SelectContent>
                  {availableStages.map((value) => (
                    <SelectItem key={value} value={value}>
                      {stageLabels[value] ?? value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              No further stage transitions are available for this lead.
            </p>
          )}

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={changeStageMutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            {hasAvailableTransitions && (
              <Button
                type="button"
                disabled={changeStageMutation.isPending || !stage}
                onClick={handleSubmit}
              >
                {changeStageMutation.isPending ? "Updating..." : "Update Stage"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
