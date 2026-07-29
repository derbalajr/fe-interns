import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/format";
import type { Deal } from "@/types/deal";

type DealCardProps = {
  deal: Deal;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
};

const stageStripeClassNames: Record<string, string> = {
  new: "bg-[#bab7f5]",
  qualified: "bg-[#86c5aa]",
  contacted: "bg-[#79b6ff]",
  negotiation: "bg-[#b4b4b4]",
  won: "bg-[#f4d584]",
  lost: "bg-[#e59999]",
};

const stageValueClassNames: Record<string, string> = {
  new: "text-[#746fe3]",
  qualified: "text-[#368267]",
  contacted: "text-[#438ee8]",
  negotiation: "text-[#666666]",
  won: "text-[#d29222]",
  lost: "text-[#b04b4b]",
};

export function DealCard({
  deal,
  onView,
  onEdit,
}: DealCardProps) {
  const stripeClassName =
    stageStripeClassNames[deal.stage] ?? "bg-[#bbbbbb]";

  const valueClassName =
    stageValueClassNames[deal.stage] ?? "text-[#555555]";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onView(deal)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView(deal);
        }
      }}
      className="group relative min-h-[100px] cursor-pointer overflow-hidden rounded-xl border border-[#e6e6e6] bg-white py-3 pl-5 pr-3 shadow-[0_2px_7px_rgba(0,0,0,0.045)] transition hover:-translate-y-0.5 hover:shadow-[0_5px_14px_rgba(0,0,0,0.07)] focus:outline-none focus:ring-2 focus:ring-[#dedede]"
    >
      <div
        className={`absolute inset-y-0 left-0 w-3 ${stripeClassName}`}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[11px] font-semibold text-[#252525]">
            {deal.lead?.name ?? "Unknown Lead"}
          </h3>

          <p className="mt-2 truncate text-[9px] text-[#555555]">
            {deal.unit?.code ?? "No Unit"}
          </p>

          <p
            className={`mt-2 text-[10px] font-medium ${valueClassName}`}
          >
            {formatCurrency(Number(deal.value ?? 0))}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Actions for ${deal.lead?.name ?? "deal"}`}
            onClick={(event) => event.stopPropagation()}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[#555555] transition hover:bg-[#f1f1f1]"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            onClick={(event) => event.stopPropagation()}
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

      {deal.agent && (
        <div className="mt-2 flex justify-end">
          <span className="max-w-[100px] truncate rounded-full bg-[#e8f8f1] px-3 py-1 text-[8px] font-medium text-[#4c7666]">
            {deal.agent.name}
          </span>
        </div>
      )}
    </article>
  );
}