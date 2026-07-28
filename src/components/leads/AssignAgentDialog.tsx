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
import { useAgentsQuery } from "@/hooks/use-agents-query";
import { useAssignLeadMutation } from "@/hooks/use-assign-lead-mutation";
import type { Lead } from "@/types/lead";

const UNASSIGNED_VALUE = "unassigned";

type AssignAgentDialogProps = {
  lead: Lead;
};

export function AssignAgentDialog({ lead }: AssignAgentDialogProps) {
  const initialValue = lead.agent ? String(lead.agent.id) : UNASSIGNED_VALUE;

  const [open, setOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(initialValue);

  const agentsQuery = useAgentsQuery();
  const assignMutation = useAssignLeadMutation();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setSelectedAgentId(
        lead.agent ? String(lead.agent.id) : UNASSIGNED_VALUE,
      );

      assignMutation.reset();
    }
  };

  const handleSubmit = async () => {
    try {
      await assignMutation.mutateAsync({
        id: lead.id,
        data: {
          agent_id:
            selectedAgentId === UNASSIGNED_VALUE
              ? null
              : Number(selectedAgentId),
        },
      });

      setOpen(false);
    } catch {
      // The mutation error is displayed inside the dialog.
    }
  };

  const mutationError =
    assignMutation.error instanceof Error ? assignMutation.error.message : null;

  const queryError =
    agentsQuery.error instanceof Error ? agentsQuery.error.message : null;

  const errorMessage = mutationError ?? queryError;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl border-[#e2e2e2] bg-white px-4 text-xs font-medium text-[#777777] shadow-[0_2px_6px_rgba(0,0,0,0.035)] hover:bg-[#f8f8f8] hover:text-[#333333]"
          >
            {lead.agent ? "Reassign Agent" : "Assign Agent"}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {lead.agent ? "Reassign Agent" : "Assign Agent"}
          </DialogTitle>

          <DialogDescription>
            Select the agent responsible for {lead.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="lead-agent" className="text-sm font-medium">
              Agent
            </label>

            <Select
              value={selectedAgentId}
              onValueChange={(value) => {
                if (value !== null) {
                  setSelectedAgentId(value);
                }
              }}
              disabled={agentsQuery.isLoading || assignMutation.isPending}
            >
              <SelectTrigger id="lead-agent">
                <SelectValue
                  placeholder={
                    agentsQuery.isLoading
                      ? "Loading agents..."
                      : "Select an agent"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>

                {agentsQuery.data?.map((agent) => (
                  <SelectItem key={agent.id} value={String(agent.id)}>
                    {agent.name} — {agent.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!agentsQuery.isLoading && agentsQuery.data?.length === 0 && (
              <p className="text-sm text-[#777777]">
                No users with the Agent role were found.
              </p>
            )}
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-[#e8e8e8] pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={assignMutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                agentsQuery.isLoading ||
                agentsQuery.isError ||
                assignMutation.isPending ||
                selectedAgentId === initialValue
              }
              onClick={handleSubmit}
            >
              {assignMutation.isPending ? "Assigning..." : "Save Assignment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}