import type { Deal } from "@/types/deal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DealDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal | null;
}

export function DealDetailsDialog({
  open,
  onOpenChange,
  deal,
}: DealDetailsDialogProps) {
  if (!deal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Deal Details</DialogTitle>

          <DialogDescription>
            View deal information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div>
            <p className="text-sm text-slate-500">Lead</p>
            <p className="font-medium">
              {deal.lead?.name ?? "--"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Agent</p>
            <p className="font-medium">
              {deal.agent?.name ?? "--"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Unit</p>
            <p className="font-medium">
              {deal.unit?.code ?? "No Unit"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Stage</p>
            <p className="font-medium capitalize">
              {deal.stage}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Deal Value
            </p>
            <p className="font-medium">
              EGP {Number(deal.value).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Expected Close
            </p>
            <p className="font-medium">
              {deal.expected_close ?? "--"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}