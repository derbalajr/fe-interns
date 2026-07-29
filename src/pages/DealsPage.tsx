import { useMemo, useState } from "react";

import { DealColumn } from "@/components/deals/DealColumn";
import { DealDetailsDialog } from "@/components/deals/DealDetailsDialog";
import {
  DealsToolbar,
  type DealAgentOption,
  type DealUnitOption,
} from "@/components/deals/DealsToolbar";
import { EditDealModal } from "@/components/deals/EditDealModal";
import { useDealsQuery } from "@/hooks/use-deals-query";
import type { Deal } from "@/types/deal";

const BOARD_STAGES = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "qualified",
    label: "Qualified",
  },
  {
    value: "contacted",
    label: "Viewing",
  },
  {
    value: "negotiation",
    label: "Negotiation",
  },
  {
    value: "won",
    label: "Won",
  },
  {
    value: "lost",
    label: "Lost",
  },
] as const;

type BoardStage = (typeof BOARD_STAGES)[number]["value"];

export default function DealsPage() {
  const { data, isLoading, isError } = useDealsQuery();

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [stageFilter, setStageFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("asc");

  const deals = useMemo(
    () => data?.data ?? [],
    [data?.data],
  );

  const agents = useMemo<DealAgentOption[]>(() => {
    const uniqueAgents = new Map<number, DealAgentOption>();

    for (const deal of deals) {
      if (deal.agent) {
        uniqueAgents.set(deal.agent.id, {
          id: deal.agent.id,
          name: deal.agent.name,
        });
      }
    }

    return Array.from(uniqueAgents.values()).sort(
      (first, second) =>
        first.name.localeCompare(second.name),
    );
  }, [deals]);

  const units = useMemo<DealUnitOption[]>(() => {
    const uniqueUnits = new Map<number, DealUnitOption>();

    for (const deal of deals) {
      if (deal.unit) {
        uniqueUnits.set(deal.unit.id, {
          id: deal.unit.id,
          code: deal.unit.code,
        });
      }
    }

    return Array.from(uniqueUnits.values()).sort(
      (first, second) =>
        first.code.localeCompare(second.code),
    );
  }, [deals]);

  const filteredDeals = useMemo(() => {
    const result = deals.filter((deal) => {
      const matchesStage =
        !stageFilter || deal.stage === stageFilter;

      const matchesAgent =
        !agentFilter ||
        deal.agent?.id === Number(agentFilter);

      const matchesUnit =
        !unitFilter ||
        deal.unit?.id === Number(unitFilter);

      return (
        matchesStage &&
        matchesAgent &&
        matchesUnit
      );
    });

    return [...result].sort((first, second) => {
      const firstStageIndex = BOARD_STAGES.findIndex(
        (stage) => stage.value === first.stage,
      );

      const secondStageIndex = BOARD_STAGES.findIndex(
        (stage) => stage.value === second.stage,
      );

      const normalizedFirstIndex =
        firstStageIndex === -1 ? BOARD_STAGES.length : firstStageIndex;

      const normalizedSecondIndex =
        secondStageIndex === -1 ? BOARD_STAGES.length : secondStageIndex;

      return sortDirection === "asc"
        ? normalizedFirstIndex -
            normalizedSecondIndex
        : normalizedSecondIndex -
            normalizedFirstIndex;
    });
  }, [
    agentFilter,
    deals,
    sortDirection,
    stageFilter,
    unitFilter,
  ]);

 const dealsByStage = useMemo<
  Record<BoardStage, Deal[]>
>(
  () => ({
    new: filteredDeals.filter(
      (deal) => deal.stage === "new",
    ),

    qualified: filteredDeals.filter(
      (deal) => deal.stage === "qualified",
    ),

    contacted: filteredDeals.filter(
      (deal) => deal.stage === "contacted",
    ),

    negotiation: filteredDeals.filter(
      (deal) => deal.stage === "negotiation",
    ),

    won: filteredDeals.filter(
      (deal) => deal.stage === "won",
    ),

    lost: filteredDeals.filter(
      (deal) => deal.stage === "lost",
    ),
  }),
  [filteredDeals],
);

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#222222]" />

          <p className="mt-4 text-sm text-[#777777]">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          Failed to load deals.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[1180px]">
        <div className="mb-7">
          <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#171717]">
            Deals
          </h1>

          <p className="mt-1.5 text-sm text-[#777777]">
            Filtered By Stage.
          </p>
        </div>

        <DealsToolbar
          stage={stageFilter}
          agentId={agentFilter}
          unitId={unitFilter}
          agents={agents}
          units={units}
          sortDirection={sortDirection}
          onStageChange={setStageFilter}
          onAgentChange={setAgentFilter}
          onUnitChange={setUnitFilter}
          onSortDirectionChange={() =>
            setSortDirection((currentDirection) =>
              currentDirection === "asc"
                ? "desc"
                : "asc",
            )
          }
        />

        <div className="mt-7 overflow-x-auto pb-5">
          <div className="flex min-w-max items-stretch gap-4">
            {BOARD_STAGES.map((stage) => (
              <DealColumn
                key={stage.value}
                stage={stage.value}
                title={stage.label}
                deals={dealsByStage[stage.value]}
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
      </section>

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