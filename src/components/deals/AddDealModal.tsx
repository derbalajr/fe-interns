import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { useState } from "react";

import { DealForm } from "@/components/deals/DealForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateDealMutation } from "@/hooks/use-create-deal-mutation";

type AddDealModalProps = {
  triggerLabel?: string;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
};

export function AddDealModal({
  triggerLabel = "Add Deal",
  triggerIcon = <Plus className="h-4 w-4" />,
  triggerClassName = "h-11 rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800",
}: AddDealModalProps) {
  const [open, setOpen] = useState(false);

  const createDeal = useCreateDealMutation();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      createDeal.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            className={triggerClassName}
          >
            {triggerIcon}
            {triggerLabel}
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Deal</DialogTitle>

          <DialogDescription>
            Add a new deal to the pipeline.
          </DialogDescription>
        </DialogHeader>

        <DealForm
          isPending={createDeal.isPending}
          onSubmit={async (formData) => {
            try {
              await createDeal.mutateAsync(formData);
              handleOpenChange(false);
            } catch {
              // The mutation error is exposed by the form or hook.
            }
          }}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}