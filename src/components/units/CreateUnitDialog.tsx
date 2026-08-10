import { useState, type ReactElement } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UnitForm } from "./UnitForm";

type CreateUnitDialogProps = {
  trigger: ReactElement;
  defaultProjectId?: number;
  lockProject?: boolean;
};

export function CreateUnitDialog({
  trigger,
  defaultProjectId,
  lockProject,
}: CreateUnitDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Unit</DialogTitle>
          <DialogDescription>
            Add a new unit to a project.
          </DialogDescription>
        </DialogHeader>

        <UnitForm
          defaultProjectId={defaultProjectId}
          lockProject={lockProject}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
