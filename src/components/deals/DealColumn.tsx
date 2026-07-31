import { Plus } from "lucide-react";

import { AddDealModal } from "@/components/deals/AddDealModal";
import { formatCurrency } from "@/lib/format";
import type { Deal } from "@/types/deal";

import { DealCard } from "./DealCard";

type DealColumnProps = {
  stage: Deal["stage"];
  title: string;
  deals: Deal[];
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
};

const stageStyles: Record<
  string,
  {
    count: string;
  }
> = {
  new: {
    count: "bg-[#f4f0ff] text-[#8b72d9]",
  },
  qualified: {
    count: "bg-[#e8f8f1] text-[#368267]",
  },
  contacted: {
    count: "bg-[#edf4ff] text-[#4c8fde]",
  },
  negotiation: {
    count: "bg-[#f2f2f2] text-[#777777]",
  },
  won: {
    count: "bg-[#fff5dc] text-[#b68425]",
  },
};

export function DealColumn({
  stage,
  title,
  deals,
  onView,
  onEdit,
}: DealColumnProps) {
  const style = stageStyles[stage] ?? stageStyles.new;

  const total = deals.reduce(
    (sum, deal) => sum + Number(deal.value ?? 0),
    0,
  );

  return (
    <section className="flex min-h-[430px] w-[225px] shrink-0 flex-col rounded-2xl border border-[#e8e8e8] bg-[#fafafa] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <header>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[12px] font-semibold text-[#282828]">
            {title}
          </h2>

          <span
            className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[10px] font-medium ${style.count}`}
          >
            {deals.length}
          </span>
        </div>

        <p className="mt-2 text-[11px] text-[#555555]">
          {formatCurrency(total)}
        </p>
      </header>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onView={onView}
            onEdit={onEdit}
          />
        ))}

        {deals.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#dddddd] bg-white">
            <p className="text-[10px] text-[#999999]">
              No deals
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-center">
        <AddDealModal
          triggerLabel="Add Deal"
          triggerIcon={<Plus className="h-4 w-4" />}
          triggerClassName="h-9 rounded-xl border border-[#e1e1e1] bg-white px-4 text-xs text-[#333333] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:bg-[#f7f7f7]"
        />
      </div>
    </section>
  );
}