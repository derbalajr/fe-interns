import { useEffect, useState } from "react";

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
  // Keep the last selected user around so the form stays mounted while the
  // dialog plays its close animation (avoids a flash of empty content).
  const [renderedUser, setRenderedUser] = useState<User | null>(user);

  useEffect(() => {
    if (user) {
      setRenderedUser(user);
    }
  }, [user]);

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

        {renderedUser && <UserForm user={renderedUser} onSuccess={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
