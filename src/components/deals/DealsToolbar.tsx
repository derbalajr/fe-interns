import {
  ArrowUpDown,
  Building2,
  Users,
} from "lucide-react";

import { AddDealModal } from "./AddDealModal";
import { FilterButton } from "./FilterButton";
import { ViewSwitcher } from "./ViewSwitcher";

interface DealsToolbarProps {
  selectedStage: string;
  selectedAgent: string;
  selectedUnit: string;
}

export function DealsToolbar({
  selectedStage,
  selectedAgent,
  selectedUnit,
}: DealsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterButton label={selectedStage} />

        <FilterButton
          label={selectedAgent}
          icon={<Users size={15} />}
        />

        <FilterButton
          label={selectedUnit}
          icon={<Building2 size={15} />}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-px bg-slate-200" />

        <ViewSwitcher />

        <AddDealModal />

        <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
          <ArrowUpDown size={15} />
          Sort
        </button>
      </div>
    </div>
  );
}