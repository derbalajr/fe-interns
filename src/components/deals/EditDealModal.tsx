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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>

          <DialogDescription>
            Update deal information.
          </DialogDescription>
        </DialogHeader>

        {deal && (
          <DealForm
            key={deal.id}
            deal={deal}
            isPending={updateDeal.isPending}
            onSubmit={async (data) => {
              try {
                await updateDeal.mutateAsync({
                  id: deal.id,
                  data,
                });

                onOpenChange(false);
              } catch {
                // The mutation handles and exposes the request error.
              }
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}