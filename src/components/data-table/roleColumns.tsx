import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Role } from "@/types/role";

export function getRoleColumns(
  onEdit: (role: Role) => void,
  onDelete: (role: Role) => void,
): ColumnDef<Role>[] {
  return [
    {
      accessorKey: "name",
      header: "Role",
    },
    {
      id: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-muted-foreground">
          {row.original.permissions.length}
        </span>
      ),
    },
    {
      id: "edit",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
