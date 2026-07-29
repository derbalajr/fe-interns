import { useMemo, useState } from "react";

import { DealColumn } from "@/components/deals/DealColumn";
import { DealDetailsDialog } from "@/components/deals/DealDetailsDialog";
import { DealsToolbar } from "@/components/deals/DealsToolbar";
import { EditDealModal } from "@/components/deals/EditDealModal";
import { useDealsQuery } from "@/hooks/use-deals-query";
import type { Deal } from "@/types/deal";

const STAGES = [
  "new",
  "contacted",
  "qualified",
  "negotiation",
  "won",
  "lost",
] as const;

type Stage = (typeof STAGES)[number];

export default function DealsPage() {
  const { data, isLoading, isError } = useDealsQuery();

  const [selectedDeal, setSelectedDeal] =
    useState<Deal | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const dealsByStage = useMemo<Record<Stage, Deal[]>>(() => {
    const deals = data?.data ?? [];

    return {
      new: deals.filter((deal) => deal.stage === "new"),

      contacted: deals.filter(
        (deal) => deal.stage === "contacted",
      ),

      qualified: deals.filter(
        (deal) => deal.stage === "qualified",
      ),

      negotiation: deals.filter(
        (deal) => deal.stage === "negotiation",
      ),

      won: deals.filter((deal) => deal.stage === "won"),

      lost: deals.filter((deal) => deal.stage === "lost"),
    };
  }, [data?.data]);

  const visibleStages = STAGES.filter(
    (stage) =>
      dealsByStage[stage].length > 0 ||
      stage === "won" ||
      stage === "lost",
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading deals...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load deals.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Deals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your sales pipeline.
          </p>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <DealsToolbar />
          </div>

          <div className="min-h-[650px] w-full overflow-x-auto overflow-y-hidden">
            <div className="flex h-full w-max items-stretch gap-4 p-4">
              {visibleStages.map((stage) => (
                <DealColumn
                  key={stage}
                  title={stage}
                  deals={dealsByStage[stage]}
                  onView={(deal) => {
                    setSelectedDeal(deal);
                    setDetailsOpen(true);
                  }}
                  onEdit={(deal) => {
                    setSelectedDeal(deal);
                    setEditOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <DealDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        deal={selectedDeal}
      />

      <EditDealModal
        open={editOpen}
        onOpenChange={setEditOpen}
        deal={selectedDeal}
      />
    </>
  );
}