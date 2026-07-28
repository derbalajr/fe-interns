import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatCurrency,
  formatDealDate,
} from "@/lib/format";
import type { Deal } from "@/types/deal";

interface DealCardProps {
  deal: Deal;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
}

const stageColors: Record<string, string> = {
  new: "bg-violet-500",
  contacted: "bg-sky-500",
  qualified: "bg-emerald-500",
  negotiation: "bg-amber-500",
  won: "bg-green-500",
  lost: "bg-slate-500",
};

export function DealCard({
  deal,
  onView,
  onEdit,
}: DealCardProps) {
  const stripe = stageColors[deal.stage] ?? "bg-slate-400";

  const initials =
    deal.agent?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "NA";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onView(deal)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView(deal);
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
    >
      {/* Left Accent */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${stripe}`}
      />

      <div className="p-4 pl-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-slate-900">
              {deal.lead?.name ?? "Unknown Lead"}
            </h3>

            <p className="truncate text-xs text-slate-500">
              {deal.unit?.code ?? "No Unit"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              className="rounded-md p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 md:opacity-0 md:group-hover:opacity-100"
            >
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={() => onView(deal)}>
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEdit(deal)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-xl font-bold tracking-tight text-slate-900">
            {formatCurrency(Number(deal.value ?? 0))}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-medium text-slate-500">
            {formatDealDate(deal.expected_close)}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
              {initials}
            </div>

            <span className="max-w-[90px] truncate text-xs font-medium text-slate-700">
              {deal.agent?.name ?? "Unassigned"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}