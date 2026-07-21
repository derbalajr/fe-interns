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

  const handleSubmit = async (data: LeadPayload) => {
    await updateMutation.mutateAsync({
      id: lead.id,
      data,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" className="rounded-xl">
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
          lead={lead}
          isPending={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
