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
import { useUpdateLeadMutation } from "@/hooks/use-update-lead-mutation";
import type { LeadFormValues } from "@/schemas/lead-schema";
import type { Lead } from "@/types/lead";

const stageOptions: Array<{
  label: string;
  value: LeadFormValues["stage"];
}> = [
  {
    label: "New",
    value: "new",
  },
  {
    label: "Contacted",
    value: "contacted",
  },
  {
    label: "Qualified",
    value: "qualified",
  },
  {
    label: "Negotiation",
    value: "negotiation",
  },
  {
    label: "Won",
    value: "won",
  },
  {
    label: "Lost",
    value: "lost",
  },
];

type UpdateStageDialogProps = {
  lead: Lead;
};

export function UpdateStageDialog({ lead }: UpdateStageDialogProps) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<LeadFormValues["stage"]>(
    lead.stage as LeadFormValues["stage"],
  );

  const updateMutation = useUpdateLeadMutation();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setStage(lead.stage as LeadFormValues["stage"]);
    }
  };

  const handleSubmit = async () => {
    await updateMutation.mutateAsync({
      id: lead.id,
      data: {
        stage,
      },
    });

    setOpen(false);
  };

  const errorMessage =
    updateMutation.error instanceof Error ? updateMutation.error.message : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" className="rounded-xl">
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
          <div className="space-y-2">
            <label htmlFor="lead-stage" className="text-sm font-medium">
              Stage
            </label>

            <Select
              value={stage}
              onValueChange={(value) =>
                setStage(value as LeadFormValues["stage"])
              }
              disabled={updateMutation.isPending}
            >
              <SelectTrigger id="lead-stage">
                <SelectValue placeholder="Select a stage" />
              </SelectTrigger>

              <SelectContent>
                {stageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              disabled={updateMutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={updateMutation.isPending || stage === lead.stage}
              onClick={handleSubmit}
            >
              {updateMutation.isPending ? "Updating..." : "Update Stage"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
