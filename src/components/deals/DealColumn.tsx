import { Inbox } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { Deal } from "@/types/deal";

import { DealCard } from "./DealCard";

interface DealColumnProps {
  title: string;
  deals: Deal[];
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
}

const stageStyles: Record<
  string,
  {
    dot: string;
    badge: string;
  }
> = {
  new: {
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
  },
  contacted: {
    dot: "bg-sky-500",
    badge: "bg-sky-100 text-sky-700",
  },
  qualified: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  negotiation: {
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  won: {
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700",
  },
  lost: {
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700",
  },
};

export function DealColumn({
  title,
  deals,
  onView,
  onEdit,
}: DealColumnProps) {
  const style = stageStyles[title] ?? stageStyles.new;

  const total = deals.reduce(
    (sum, deal) => sum + Number(deal.value ?? 0),
    0,
  );

  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-2xl border border-slate-300/60 bg-slate-100/70 transition-colors duration-200 hover:bg-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
            />

            <h2 className="text-[15px] font-semibold capitalize text-slate-900">
              {title}
            </h2>
          </div>

          <span
            className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold ${style.badge}`}
          >
            {deals.length}
          </span>
        </div>

        <p className="mt-2 text-lg font-bold text-slate-900">
          {formatCurrency(total)}
        </p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3">
        {deals.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400">
            <Inbox size={28} strokeWidth={1.75} />

            <p className="mt-3 text-sm font-medium">
              No deals yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onView={onView}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}