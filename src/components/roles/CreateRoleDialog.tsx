import { useState, type ReactElement } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RoleForm } from "./RoleForm";

type CreateRoleDialogProps = {
  trigger: ReactElement;
};

export function CreateRoleDialog({ trigger }: CreateRoleDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>

          <DialogDescription>
            Create a new role and assign permissions.
          </DialogDescription>
        </DialogHeader>

        <RoleForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
