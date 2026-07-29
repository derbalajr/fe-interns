import { useState } from "react";

import { LeadForm } from "@/components/leads/LeadForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateLeadMutation } from "@/hooks/use-update-lead-mutation";
import type { LeadPayload } from "@/schemas/lead-schema";
import type { Lead } from "@/types/lead";

type EditLeadDialogProps = {
  lead: Lead;
};

export function EditLeadDialog({ lead }: EditLeadDialogProps) {
  const [open, setOpen] = useState(false);

  const updateMutation = useUpdateLeadMutation();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      updateMutation.reset();
    }
  };

  const handleSubmit = async (data: LeadPayload) => {
    try {
      await updateMutation.mutateAsync({
        id: lead.id,
        data,
      });

      setOpen(false);
    } catch {
      // The form or mutation displays the request error.
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl border-[#e2e2e2] bg-white px-4 text-xs font-medium text-[#777777] shadow-[0_2px_6px_rgba(0,0,0,0.035)] hover:bg-[#f8f8f8] hover:text-[#333333]"
          >
            Edit Lead
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>

          <DialogDescription>
            Update {lead.name}&apos;s information.
          </DialogDescription>
        </DialogHeader>

        <LeadForm
          key={lead.id}
          lead={lead}
          isPending={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}