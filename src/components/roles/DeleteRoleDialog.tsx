import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useDeleteRoleMutation } from "@/hooks/use-delete-role-mutation";
import type { Role } from "@/types/role";

type DeleteRoleDialogProps = {
  role: Role | null;
  onClose: () => void;
};

export function DeleteRoleDialog({
  role,
  onClose,
}: DeleteRoleDialogProps) {
  const deleteMutation = useDeleteRoleMutation();

  const handleDelete = async () => {
    if (!role) return;

    try {
      await deleteMutation.mutateAsync(role.id);
      onClose();
    } catch {
      alert("This role cannot be deleted.");
    }
  };

  return (
    <Dialog
      open={role !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{role?.name}</strong>?
            <br />
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? "Deleting..."
              : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}