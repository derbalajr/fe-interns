import { useEffect, useState } from "react";

import { DealForm } from "@/components/deals/DealForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateDealMutation } from "@/hooks/use-update-deal-mutation";
import type { Deal } from "@/types/deal";

interface EditDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
}

export function EditDealModal({
  open,
  onOpenChange,
  deal,
}: EditDealModalProps) {
  const updateDeal = useUpdateDealMutation();

  const [currentDeal, setCurrentDeal] =
    useState<Deal | null>(deal);

  useEffect(() => {
    setCurrentDeal(deal);
  }, [deal]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>

          <DialogDescription>
            Update deal information.
          </DialogDescription>
        </DialogHeader>

        {currentDeal && (
          <DealForm
            deal={currentDeal}
            isPending={updateDeal.isPending}
            onSubmit={async (data) => {
              await updateDeal.mutateAsync({
                id: currentDeal.id,
                data,
              });

              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}