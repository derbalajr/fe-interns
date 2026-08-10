import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";

import { UnitStatusBadge } from "@/components/units/UnitStatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getUnitCoverImage } from "@/lib/unit-images";
import type { Unit } from "@/types/unit";
import { formatUnitArea } from "@/utils/unit";

export function getUnitColumns(
  onView: (unit: Unit) => void,
): ColumnDef<Unit>[] {
  return [
    {
      accessorKey: "code",
      header: "Unit",
      cell: ({ row }) => {
        const unit = row.original;

        return (
          <div className="flex items-center gap-3">
            <img
              src={getUnitCoverImage(unit, 80, 80)}
              alt=""
              loading="lazy"
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0">
              <p className="truncate font-medium text-[#242424]">{unit.code}</p>
              <p className="truncate text-[12px] text-[#8a8a8a]">
                {unit.project?.name ?? unit.project?.title ?? "—"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-[#4c4c4c]">{row.original.type || "—"}</span>
      ),
    },
    {
      accessorKey: "area",
      header: "Area",
      cell: ({ row }) => (
        <span className="text-[#4c4c4c]">
          {formatUnitArea(row.original.area)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <UnitStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium text-[#242424]">
          {formatCurrency(Number(row.original.price))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onView(row.original)}
            className="h-8 gap-1 rounded-lg px-3 text-xs text-[#3a6df0] hover:bg-[#f2f6ff]"
          >
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];
}
