import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User, UserStatus } from "@/types/user";

function assertNever(value: never): never {
  throw new Error(`Unexpected user status: ${String(value)}`);
}

function getStatusVariant(
  status: UserStatus,
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "Active":
      return "default";

    case "Inactive":
      return "destructive";

    default:
      return assertNever(status);
  }
}

function getRoleVariant(role: User["role"]) {
  switch (role) {
    case "Manager":
      return "default";

    case "Agent":
      return "secondary";

    default:
      return "secondary";
  }
}

export function getUserColumns(
  onEdit: (user: User) => void,
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
              {user.name.charAt(0)}
            </div>

            <div>
              <p className="font-medium">{user.name}</p>

              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={getRoleVariant(row.original.role)}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      ),
    },
  ];
}
