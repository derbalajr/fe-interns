import { ArrowDownUp, Filter, Home, Layers, Wallet } from "lucide-react";

import type { UnitSort } from "@/api/unitApi";
import { PRICE_RANGES, type PriceRangeKey } from "@/lib/unit-filters";
import type { UnitStatus } from "@/types/unit";

const SORT_OPTIONS: { value: UnitSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const STATUS_OPTIONS: { value: UnitStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

const selectClassName =
  "h-11 rounded-xl border border-[#e8e8e8] bg-white px-4 text-xs text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.035)] outline-none transition focus:border-[#cccccc]";

type UnitsToolbarProps = {
  type: string;
  status: string;
  priceRange: PriceRangeKey;
  sort: UnitSort;
  typeOptions: string[];
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriceRangeChange: (value: PriceRangeKey) => void;
  onSortChange: (value: UnitSort) => void;
};

export function UnitsToolbar({
  type,
  status,
  priceRange,
  sort,
  typeOptions,
  onTypeChange,
  onStatusChange,
  onPriceRangeChange,
  onSortChange,
}: UnitsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Home className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />

          <select
            aria-label="Filter units by type"
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
            className={`${selectClassName} min-w-[135px] pl-9`}
          >
            <option value="">Type: All</option>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Layers className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />

          <select
            aria-label="Filter units by status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className={`${selectClassName} min-w-[135px] pl-9`}
          >
            <option value="">Status: All</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />

          <select
            aria-label="Filter units by price"
            value={priceRange}
            onChange={(event) =>
              onPriceRangeChange(event.target.value as PriceRangeKey)
            }
            className={`${selectClassName} min-w-[150px] pl-9`}
          >
            {(
              Object.entries(PRICE_RANGES) as [
                PriceRangeKey,
                (typeof PRICE_RANGES)[PriceRangeKey],
              ][]
            ).map(([key, range]) => (
              <option key={key} value={key}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative">
          <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />

          <select
            aria-label="Sort units"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as UnitSort)}
            className={`${selectClassName} min-w-[170px] pl-9`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort By: {option.label}
              </option>
            ))}
          </select>
        </div>

        <span className="hidden h-11 items-center gap-2 rounded-xl border border-[#e8e8e8] bg-white px-3.5 text-xs text-[#999999] shadow-[0_2px_8px_rgba(0,0,0,0.035)] sm:flex">
          <Filter className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
