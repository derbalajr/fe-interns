import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, PackageOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getUnitColumns } from "@/components/data-table/unitColumns";
import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { UnitsToolbar } from "@/components/units/UnitsToolbar";
import type { UnitSort } from "@/api/unitApi";
import { PRICE_RANGES, type PriceRangeKey } from "@/lib/unit-filters";
import { useProjectQuery } from "@/hooks/use-project-query";
import { useUnitsQuery } from "@/hooks/use-units-query";

export function ProjectUnitsPage() {
  const navigate = useNavigate();
  const { projectId = "" } = useParams();
  const numericProjectId = Number(projectId);

  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeKey>("any");
  const [sort, setSort] = useState<UnitSort>("newest");

  const projectQuery = useProjectQuery(projectId);

  const { minPrice, maxPrice } = PRICE_RANGES[priceRange];

  // Server-side filters (type/status/price/sort). project_id isn't a backend
  // filter yet, so we scope to this project on the client below.
  const unitsQuery = useUnitsQuery({
    type: type || undefined,
    status: status || undefined,
    minPrice,
    maxPrice,
    sort,
  });

  // Unfiltered, project-scoped set used only to build stable Type options so
  // the dropdown doesn't collapse as the user narrows the filters.
  const allUnitsQuery = useUnitsQuery();

  // The backend (once PR #29 is deployed) applies type/status/price/sort, and
  // there is no `project_id` filter server-side. We re-apply everything on the
  // client so the feature works today too — filtering is idempotent, so this
  // is a no-op on rows the backend already narrowed.
  const projectUnits = useMemo(() => {
    let rows = (unitsQuery.data?.data ?? []).filter(
      (unit) => unit.project_id === numericProjectId,
    );

    if (type) {
      rows = rows.filter((unit) => unit.type === type);
    }

    if (status) {
      rows = rows.filter((unit) => unit.status === status);
    }

    if (typeof minPrice === "number") {
      rows = rows.filter((unit) => Number(unit.price) >= minPrice);
    }

    if (typeof maxPrice === "number") {
      rows = rows.filter((unit) => Number(unit.price) <= maxPrice);
    }

    return [...rows].sort((first, second) => {
      switch (sort) {
        case "price_asc":
          return Number(first.price) - Number(second.price);
        case "price_desc":
          return Number(second.price) - Number(first.price);
        case "oldest":
          return first.id - second.id;
        case "newest":
        default:
          return second.id - first.id;
      }
    });
  }, [
    unitsQuery.data?.data,
    numericProjectId,
    type,
    status,
    minPrice,
    maxPrice,
    sort,
  ]);

  const typeOptions = useMemo(() => {
    const types = new Set<string>();

    for (const unit of allUnitsQuery.data?.data ?? []) {
      if (unit.project_id === numericProjectId && unit.type) {
        types.add(unit.type);
      }
    }

    return Array.from(types).sort();
  }, [allUnitsQuery.data?.data, numericProjectId]);

  const columns = useMemo(
    () => getUnitColumns((unit) => navigate(`/units/${unit.id}`)),
    [navigate],
  );

  const project = projectQuery.data;
  const isLoading = projectQuery.isLoading || unitsQuery.isLoading;
  const isError = projectQuery.isError || unitsQuery.isError;

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <button
        type="button"
        onClick={() => navigate("/projects")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-[#777777] transition hover:text-[#333333]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to inventory
      </button>

      <div className="mb-7">
        <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#171717]">
          {project?.name ?? (projectQuery.isLoading ? "Loading…" : "Units")}
        </h1>

        {project?.location && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#777777]">
            <MapPin className="h-4 w-4" />
            {project.location}
          </p>
        )}
      </div>

      <div className="mb-6">
        <UnitsToolbar
          type={type}
          status={status}
          priceRange={priceRange}
          sort={sort}
          typeOptions={typeOptions}
          onTypeChange={setType}
          onStatusChange={setStatus}
          onPriceRangeChange={setPriceRange}
          onSortChange={setSort}
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#222222]" />
            <p className="mt-4 text-sm text-[#777777]">Loading units…</p>
          </div>
        </div>
      ) : isError ? (
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
      ) : projectUnits.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No units match your filters"
          description="Try adjusting the type, status, or price filters to see more units in this project."
        />
      ) : (
        <DataTable columns={columns} data={projectUnits} pageSize={8} />
      )}
    </section>
  );
}
