import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UserForm } from "./UserForm";
import type { User } from "@/types/user";

type EditUserDialogProps = {
  user: User | null;
  onClose: () => void;
};

export function EditUserDialog({ user, onClose }: EditUserDialogProps) {
  return (
    <Dialog
      open={user !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>

          <DialogDescription>Update the user's information.</DialogDescription>
        </DialogHeader>

        {user && <UserForm user={user} onSuccess={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
