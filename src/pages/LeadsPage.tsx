import { useMemo, useState } from "react";

import { DataTable } from "@/components/data-table/DataTable";
import { getLeadColumns } from "@/components/data-table/leadColumns";
import { LeadToolbar } from "@/components/leads/LeadToolbar";
import { useLeadsQuery } from "@/hooks/use-leads-query";

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");

  const { data, isLoading, isError } = useLeadsQuery({
    page,
    search,
    stage,
    source,
  });

  const columns = useMemo(() => getLeadColumns(), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading leads...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load leads.
      </div>
    );
  }

  const currentPage = data?.meta.current_page ?? 1;
  const lastPage = data?.meta.last_page ?? 1;

  return (
    <div className="mx-auto max-w-[1280px] space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Leads
        </h1>

        <p className="mt-2 text-base text-slate-500">
          Everyone your agents are working, in one pipeline.
        </p>
      </div>

      {/* Toolbar */}
      <LeadToolbar
        search={search}
        stage={stage}
        source={source}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStageChange={(value) => {
          setStage(value);
          setPage(1);
        }}
        onSourceChange={(value) => {
          setSource(value);
          setPage(1);
        }}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        manualPagination
        currentPage={currentPage}
        pageCount={lastPage}
        onPreviousPage={() => {
          if (currentPage > 1) {
            setPage((prev) => prev - 1);
          }
        }}
        onNextPage={() => {
          if (currentPage < lastPage) {
            setPage((prev) => prev + 1);
          }
        }}
      />
    </div>
  );
}