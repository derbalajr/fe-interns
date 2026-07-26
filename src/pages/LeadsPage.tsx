import { useCallback, useMemo, useState } from "react";

import { DataTable } from "@/components/data-table/DataTable";
import { getLeadColumns } from "@/components/data-table/leadColumns";
import { LeadToolbar } from "@/components/leads/LeadToolbar";
import { useLeadsQuery } from "@/hooks/use-leads-query";
import { useTenant } from "@/hooks/use-tenant";

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
  const { tenant } = useTenant();

  const columns = useMemo(() => getLeadColumns(tenant?.currency), [tenant?.currency]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStageChange = useCallback((value: string) => {
    setStage(value);
    setPage(1);
  }, []);

  const handleSourceChange = useCallback((value: string) => {
    setSource(value);
    setPage(1);
  }, []);

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
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Leads
        </h1>

        <p className="mt-2 text-base text-slate-500">
          Everyone your agents are working, in one pipeline.
        </p>
      </div>

      <LeadToolbar
        search={search}
        stage={stage}
        source={source}
        onSearchChange={handleSearchChange}
        onStageChange={handleStageChange}
        onSourceChange={handleSourceChange}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        manualPagination
        currentPage={currentPage}
        pageCount={lastPage}
        onPreviousPage={() => {
          if (currentPage > 1) {
            setPage((previousPage) => previousPage - 1);
          }
        }}
        onNextPage={() => {
          if (currentPage < lastPage) {
            setPage((previousPage) => previousPage + 1);
          }
        }}
      />
    </div>
  );
}