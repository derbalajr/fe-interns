import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { useTenant } from "@/hooks/use-tenant";
import type { Lead } from "@/types/lead";

export function useLeadColumns(): ColumnDef<Lead>[] {
  const { tenant } = useTenant();

  return useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Client Name",
      },
      {
        accessorKey: "budget",
        header: "Budget",
        cell: ({ row }) => {
          const budget = row.original.budget;

          if (budget === null) {
            return "—";
          }

          return new Intl.NumberFormat("en-EG", {
            style: "currency",
            currency: tenant?.currency || "EGP",
          }).format(budget);
        },
      },
    ],
    [tenant?.currency],
  );
}