import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, PackageOpen, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
import { useUnitsQuery } from "@/hooks/use-units-query";

export function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { can } = useCan();
  const { projectId = "" } = useParams();
  const numericProjectId = Number(projectId);

  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeKey>("any");
  const [sort, setSort] = useState<UnitSort>("newest");

  const projectQuery = useProjectQuery(projectId);
  const { minPrice, maxPrice } = PRICE_RANGES[priceRange];

  const unitsQuery = useUnitsQuery({
    type: type || undefined,
    status: status || undefined,
    minPrice,
    maxPrice,
    sort,
  });
  const allUnitsQuery = useUnitsQuery();

  // Units of this project, with the filters re-applied on the client (see
  // UnitsPage for why). project_id isn't a backend filter yet.
  const projectUnits = useMemo(() => {
    let rows = (unitsQuery.data?.data ?? []).filter(
      (unit) => unit.project_id === numericProjectId,
    );

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
  }, [
    unitsQuery.data?.data,
    numericProjectId,
    type,
    status,
    minPrice,
    maxPrice,
    sort,
  ]);

  // Stats from the unfiltered, project-scoped set.
  const projectAllUnits = useMemo(
    () =>
      (allUnitsQuery.data?.data ?? []).filter(
        (unit) => unit.project_id === numericProjectId,
      ),
    [allUnitsQuery.data?.data, numericProjectId],
  );

  const stats = useMemo(
    () => ({
      total: projectAllUnits.length,
      available: projectAllUnits.filter((u) => u.status === "available").length,
      reserved: projectAllUnits.filter((u) => u.status === "reserved").length,
      sold: projectAllUnits.filter((u) => u.status === "sold").length,
    }),
    [projectAllUnits],
  );

  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    for (const unit of projectAllUnits) {
      if (unit.type) types.add(unit.type);
    }
    return Array.from(types).sort();
  }, [projectAllUnits]);

  const columns = useMemo(
    () => getUnitColumns((unit) => navigate(`/units/${unit.id}`)),
    [navigate],
  );

  const project = projectQuery.data;

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <button
        type="button"
        onClick={() => navigate("/projects")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-[#777777] transition hover:text-[#333333]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </button>

      {/* Project details */}
      <div className="mb-7 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#171717]">
              {project?.name ??
                (projectQuery.isLoading ? "Loading…" : "Project")}
            </h1>

            {project?.location && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#777777]">
                <MapPin className="h-4 w-4" />
                {project.location}
              </p>
            )}
          </div>

          {can("create-units") && project && (
            <CreateUnitDialog
              defaultProjectId={project.id}
              lockProject
              trigger={
                <Button type="button" className="h-10 gap-1.5 rounded-xl px-4">
                  <Plus className="h-4 w-4" />
                  Create unit
                </Button>
              }
            />
          )}
        </div>

        {project?.description && (
          <p className="mt-4 max-w-2xl text-sm text-[#666666]">
            {project.description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total units" value={stats.total} />
          <Stat label="Available" value={stats.available} />
          <Stat label="Reserved" value={stats.reserved} />
          <Stat label="Sold" value={stats.sold} />
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-[#242424]">
        Units in this project
      </h2>

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

      {unitsQuery.isLoading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#222222]" />
            <p className="mt-4 text-sm text-[#777777]">Loading units…</p>
          </div>
        </div>
      ) : unitsQuery.isError ? (
        <div className="flex min-h-[280px] items-center justify-center">
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
          description="Try adjusting the type, status, or price filters."
        />
      ) : (
        <DataTable columns={columns} data={projectUnits} pageSize={8} />
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[#f7f7f7] px-4 py-3">
      <p className="text-[22px] font-semibold text-[#171717]">{value}</p>
      <p className="text-xs text-[#8a8a8a]">{label}</p>
    </div>
  );
}
