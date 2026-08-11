import { useState, type ReactElement } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Unit } from "@/types/unit";

import { UnitForm } from "./UnitForm";

type EditUnitDialogProps = {
  trigger: ReactElement;
  unit: Unit;
};

export function EditUnitDialog({
  trigger,
  unit,
}: EditUnitDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogDescription>
            Update this unit and manage its photos.
          </DialogDescription>
        </DialogHeader>

        <UnitForm
          mode="edit"
          unit={unit}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}