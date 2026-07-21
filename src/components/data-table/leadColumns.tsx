import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { getCurrentTenant } from "@/lib/tenant";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/lead";

const { currency: currencyCode } = getCurrentTenant();

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: currencyCode,
  maximumFractionDigits: 0,
});

function getStageVariant(stage: Lead["stage"]) {
  switch (stage) {
    case "New":
      return "secondary";

    case "Qualified":
      return "default";

    case "Contacted":
      return "outline";

    case "Lost":
      return "destructive";

    default:
      return "secondary";
  }
}

export function getLeadColumns(): ColumnDef<Lead>[] {
  return [
    {
      accessorKey: "name",
      header: "Lead",
      cell: ({ row }) => {
        const lead = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
              {lead.name.charAt(0)}
            </div>

            <div>
              <p className="font-medium">{lead.name}</p>

              <p className="text-sm text-muted-foreground">
                {lead.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => (
        <Badge variant={getStageVariant(row.original.stage)}>
          {row.original.stage}
        </Badge>
      ),
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "agent",
      header: "Agent",
      cell: ({ row }) => row.original.agent?.name ?? "-",
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const budget = row.original.budget;

        return budget == null ? "—" : currency.format(budget);
      },
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}