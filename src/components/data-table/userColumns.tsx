import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserRoleName, getUserStatus } from "@/lib/user";
import type { User, UserStatus } from "@/types/user";

const statusStyles: Record<UserStatus, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-rose-50 text-rose-500",
};

function StatusPill({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function getUserColumns(
  onEdit: (user: User) => void,
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9e5dd] text-[13px] font-semibold text-[#5c5647]">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-[#242424]">{user.name}</p>
              <p className="truncate text-[12px] text-[#8a8a8a]">
                {user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusPill status={getUserStatus(row.original)} />,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-[#4c4c4c]">
          {getUserRoleName(row.original) || "—"}
        </span>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <span className="text-[#4c4c4c]">{row.original.position ?? "—"}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => (
        <span className="text-[#4c4c4c]">{row.original.phone ?? "—"}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${row.original.name}`}
                  className="text-[#8a8a8a] hover:text-[#242424]"
                />
              }
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="h-4 w-4" />
                Edit agent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
