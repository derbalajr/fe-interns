import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Lead } from "@/types/lead";

function formatStageLabel(stage: Lead["stage"]): string {
  if (stage === "unqualified") {
    return "Out";
  }

  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

function getStageClassName(stage: Lead["stage"]): string {
  switch (stage) {
    case "qualified":
      return "bg-[#e7f8f1] text-[#34866b]";

    case "contacted":
      return "bg-[#f0f0f0] text-[#686868]";

    case "unqualified":
      return "bg-[#fde9e9] text-[#a44848]";

    case "new":
      return "bg-[#fff4dc] text-[#8a743d]";

    default:
      return "bg-[#f0f0f0] text-[#686868]";
  }
}

function formatSource(source: Lead["source"]): string {
  return source
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getAiScore(lead: Lead): number | null {
  const rawScore = lead.ai_score;

  if (rawScore === null || rawScore === undefined || rawScore === "") {
    return null;
  }

  const numericScore = Number(rawScore);

  return Number.isFinite(numericScore) ? numericScore : null;
}

export function getLeadColumns(): ColumnDef<Lead>[] {
  return [
    {
      accessorKey: "name",
      header: "Leads",
      size: 280,
      cell: ({ row }) => {
        const lead = row.original;
        const initial = lead.name.trim().charAt(0).toUpperCase() || "?";

        return (
          <Link
            to={`/leads/${lead.id}`}
            className="group flex min-w-0 items-center gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8ded1] text-xs font-semibold text-[#5e5144]">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#262626] group-hover:underline">
                {lead.name}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-[#797979]">
                {lead.phone || lead.email}
              </p>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "stage",
      header: "Stage",
      size: 150,
      cell: ({ row }) => {
        const stage = row.original.stage;

        return (
          <span
            className={`inline-flex min-w-[76px] items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium ${getStageClassName(
              stage,
            )}`}
          >
            {formatStageLabel(stage)}
          </span>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
      size: 175,
      cell: ({ row }) => (
        <span className="text-[12px] text-[#555555]">
          {formatSource(row.original.source)}
        </span>
      ),
    },
    {
      id: "assignedAgent",
      header: "Assigned Agent",
      size: 190,
      cell: ({ row }) => (
        <span className="text-[12px] text-[#555555]">
          {row.original.agent?.name ?? "—"}
        </span>
      ),
    },
    {
      id: "aiScore",
      header: "AI Score",
      size: 110,
      cell: ({ row }) => {
        const score = getAiScore(row.original);

        return (
          <span className="text-[12px] font-medium text-[#555555]">
            {score ?? "—"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 60,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Link
            to={`/leads/${row.original.id}`}
            aria-label={`View ${row.original.name}`}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#a9a9a9] text-[#686868] transition hover:border-[#303030] hover:bg-[#303030] hover:text-white"
          >
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ),
    },
  ];
}