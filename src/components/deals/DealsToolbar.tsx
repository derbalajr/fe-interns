import {
  ArrowDownUp,
  Columns2,
  Filter,
  LayoutList,
  Plus,
  Users,
  Warehouse,
} from "lucide-react";

import { AddDealModal } from "@/components/deals/AddDealModal";
import { Button } from "@/components/ui/button";

export type DealAgentOption = {
  id: number;
  name: string;
};

export type DealUnitOption = {
  id: number;
  code: string;
};

type DealsToolbarProps = {
  stage: string;
  agentId: string;
  unitId: string;
  agents: DealAgentOption[];
  units: DealUnitOption[];
  sortDirection: "asc" | "desc";
  onStageChange: (value: string) => void;
  onAgentChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onSortDirectionChange: () => void;
};

const selectClassName =
  "h-11 rounded-xl border border-[#e8e8e8] bg-white px-4 text-xs text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.035)] outline-none transition focus:border-[#cccccc]";

export function DealsToolbar({
  stage,
  agentId,
  unitId,
  agents,
  units,
  sortDirection,
  onStageChange,
  onAgentChange,
  onUnitChange,
  onSortDirectionChange,
}: DealsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />

          <select
            aria-label="Filter deals by stage"
            value={stage}
            onChange={(event) => onStageChange(event.target.value)}
            className={`${selectClassName} min-w-[135px] pl-9`}
          >
            <option value="">All Stages</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="contacted">Viewing</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div className="relative">
          <Users className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />

          <select
            aria-label="Filter deals by agent"
            value={agentId}
            onChange={(event) => onAgentChange(event.target.value)}
            className={`${selectClassName} min-w-[140px] pl-9`}
          >
            <option value="">All Agents</option>

            {agents.map((agent) => (
              <option key={agent.id} value={String(agent.id)}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Warehouse className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />

          <select
            aria-label="Filter deals by unit"
            value={unitId}
            onChange={(event) => onUnitChange(event.target.value)}
            className={`${selectClassName} min-w-[135px] pl-9`}
          >
            <option value="">All Units</option>

            {units.map((unit) => (
              <option key={unit.id} value={String(unit.id)}>
                {unit.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Board view"
          className="rounded-xl border-[#e8e8e8] bg-white text-[#777777] shadow-[0_2px_8px_rgba(0,0,0,0.035)]"
        >
          <Columns2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="List view"
          disabled
          className="rounded-xl border-[#e8e8e8] bg-white text-[#999999] shadow-[0_2px_8px_rgba(0,0,0,0.035)] disabled:opacity-100"
        >
          <LayoutList className="h-4 w-4" />
        </Button>

        <AddDealModal
          triggerLabel="All Units"
          triggerIcon={<Plus className="h-4 w-4" />}
          triggerClassName="h-11 rounded-xl bg-[#222222] px-5 text-xs text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#333333]"
        />

        <Button
          type="button"
          variant="outline"
          onClick={onSortDirectionChange}
          className="h-11 rounded-xl border-[#e8e8e8] bg-white px-4 text-xs text-[#777777] shadow-[0_2px_8px_rgba(0,0,0,0.035)]"
        >
          Sort By: Stage
          <ArrowDownUp
            className={`ml-2 h-3.5 w-3.5 transition ${
              sortDirection === "desc" ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>
    </div>
  );
}