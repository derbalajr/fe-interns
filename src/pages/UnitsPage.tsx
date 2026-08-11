import { useMemo, useState } from "react";
import { PackageOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getUnitColumns } from "@/components/data-table/unitColumns";
import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { CreateUnitDialog } from "@/components/units/CreateUnitDialog";
import { UnitsToolbar } from "@/components/units/UnitsToolbar";
import { Button } from "@/components/ui/button";
import type { UnitSort } from "@/api/unitApi";
import { PRICE_RANGES, type PriceRangeKey } from "@/lib/unit-filters";
import { useCan } from "@/hooks/use-can";
import { useProjectQuery } from "@/hooks/use-project-query";
import { useProjectsQuery } from "@/hooks/use-projects-query";
import { useUnitsQuery } from "@/hooks/use-units-query";

export function UnitsPage() {
  const navigate = useNavigate();
  const { can } = useCan();

  const [projectId, setProjectId] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeKey>("any");
  const [sort, setSort] = useState<UnitSort>("newest");

  const { minPrice, maxPrice } = PRICE_RANGES[priceRange];

  const selectedProjectId = projectId ? Number(projectId) : undefined;

  const unitsQuery = useUnitsQuery({
    type: type || undefined,
    status: status || undefined,
    minPrice,
    maxPrice,
    sort,
    projectId: selectedProjectId,
  });

  // Unfiltered fetch for stable Type and Project options.
  const allUnitsQuery = useUnitsQuery();
  const projectsQuery = useProjectsQuery();

  // Re-apply filters client-side so they work even before backend PR #29 is
  // deployed; idempotent once it is.
  const units = useMemo(() => {
    let rows = unitsQuery.data?.data ?? [];

    if (projectId)
      rows = rows.filter((unit) => unit.project_id === selectedProjectId);
    if (type) rows = rows.filter((unit) => unit.type === type);
    if (status) rows = rows.filter((unit) => unit.status === status);
    if (typeof minPrice === "number")
      rows = rows.filter((unit) => Number(unit.price) >= minPrice);
    if (typeof maxPrice === "number")
      rows = rows.filter((unit) => Number(unit.price) <= maxPrice);

    return [...rows].sort((first, second) => {
      switch (sort) {
        case "price_asc":
          return Number(first.price) - Number(second.price);
        case "price_desc":
          return Number(second.price) - Number(first.price);
        case "oldest":
          return first.id - second.id;
        default:
          return second.id - first.id;
      }
    });
  }, [unitsQuery.data?.data, type, status, minPrice, maxPrice, sort]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    for (const unit of allUnitsQuery.data?.data ?? []) {
      if (unit.type) types.add(unit.type);
    }
    return Array.from(types).sort();
  }, [allUnitsQuery.data?.data]);

  const projectOptions = useMemo(() => {
    const projects = projectsQuery.data?.data ?? [];
    return [...projects].sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [projectsQuery.data?.data]);

  const columns = useMemo(
    () => getUnitColumns((unit) => navigate(`/units/${unit.id}`)),
    [navigate],
  );

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#171717]">
            Units
          </h1>
          <p className="mt-1.5 text-sm text-[#777777]">
            All units across the MarQ portfolio.
          </p>
        </div>

        {can("create-units") && (
          <CreateUnitDialog
            trigger={
              <Button type="button" className="h-10 gap-1.5 rounded-xl px-4">
                <Plus className="h-4 w-4" />
                Create unit
              </Button>
            }
          />
        )}
      </div>

      <div className="mb-6">
        <UnitsToolbar
          projectId={projectId}
          projectOptions={projectOptions}
          type={type}
          status={status}
          priceRange={priceRange}
          sort={sort}
          typeOptions={typeOptions}
          onProjectChange={setProjectId}
          onTypeChange={setType}
          onStatusChange={setStatus}
          onPriceRangeChange={setPriceRange}
          onSortChange={setSort}
        />
      </div>

      {unitsQuery.isLoading ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#222222]" />
            <p className="mt-4 text-sm text-[#777777]">Loading units…</p>
          </div>
        </div>
      ) : unitsQuery.isError ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="text-center">
            <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              Failed to load units.
            </p>
            <button
              type="button"
              onClick={() => unitsQuery.refetch()}
              className="mt-4 text-sm font-medium text-[#3a6df0] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      ) : units.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No units match your filters"
          description="Try adjusting the type, status, or price filters."
        />
      ) : (
        <DataTable columns={columns} data={units} pageSize={10} />
      )}
    </section>
  );
}
