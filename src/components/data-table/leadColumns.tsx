import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { getCurrentTenant } from "@/lib/tenant";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
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
              <Link
                to={`/leads/${lead.id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {lead.name}
              </Link>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
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
      cell: ({ row }) => (
        <Link
          to={`/leads/${row.original.id}`}
          aria-label={`View ${row.original.name}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Link>
      ),
    },
  ];
}
