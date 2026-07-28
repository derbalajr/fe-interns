import { Plus } from "lucide-react";
import { useState } from "react";
import { DealForm } from "./DealForm";
import { useCreateDealMutation } from "@/hooks/use-create-deal-mutation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddDealModal() {
  const [open, setOpen] = useState(false);
const createDeal = useCreateDealMutation();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            className="h-11 rounded-xl bg-slate-900 px-5 text-white hover:bg-slate-800"
          >
            <Plus size={16} className="mr-2" />
            Add Deal
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

        {<DealForm
  isPending={createDeal.isPending}
  onSubmit={async (data) => {
    await createDeal.mutateAsync(data);
    setOpen(false);
  }}
  onCancel={() => setOpen(false)}
/>}
      </DialogContent>
    </Dialog>
  );
}