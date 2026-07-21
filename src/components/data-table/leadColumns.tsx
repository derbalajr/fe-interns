import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/lead";

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
      cell: ({ row }) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(row.original.budget),
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