import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { RoleForm } from "./RoleForm";
import type { Role } from "@/types/role";

type EditRoleDialogProps = {
  role: Role | null;
  onClose: () => void;
};

export function EditRoleDialog({
  role,
  onClose,
}: EditRoleDialogProps) {
  return (
    <Dialog
      open={role !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>

          <DialogDescription>
            Update role permissions.
          </DialogDescription>
        </DialogHeader>

        {role && (
          <RoleForm
            role={role}
            onSuccess={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}