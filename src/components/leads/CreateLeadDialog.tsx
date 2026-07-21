import { Plus } from "lucide-react";
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
import { useCreateLeadMutation } from "@/hooks/use-create-lead-mutation";
import type { LeadPayload } from "@/schemas/lead-schema";

export function CreateLeadDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateLeadMutation();

  const handleSubmit = async (data: LeadPayload) => {
    await createMutation.mutateAsync(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            className="h-11 rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800"
          >
            <Plus size={16} className="mr-2" />
            New Lead
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Lead</DialogTitle>

          <DialogDescription>Add a new lead to the pipeline.</DialogDescription>
        </DialogHeader>

        <LeadForm
          isPending={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
