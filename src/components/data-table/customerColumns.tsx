import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { Customer, CustomerStatus } from "@/types/customer";

function assertNever(value: never): never {
  throw new Error(`Unexpected customer status: ${String(value)}`);
}

function getStatusVariant(
  status: CustomerStatus,
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "active":
      return "default";

    case "pending":
      return "secondary";

    case "inactive":
      return "destructive";

    default:
      return assertNever(status);
  }
}

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "Customer ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as CustomerStatus;

      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
];
