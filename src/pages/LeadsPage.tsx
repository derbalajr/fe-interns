import { useCallback, useMemo, useState } from "react";

import { DataTable } from "@/components/data-table/DataTable";
import { getLeadColumns } from "@/components/data-table/leadColumns";
import {
  LeadToolbar,
  type LeadAgentOption,
} from "@/components/leads/LeadToolbar";
import { useAgentsQuery } from "@/hooks/use-agents-query";
import { useLeadsQuery } from "@/hooks/use-leads-query";

const leadColumns = getLeadColumns();

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [agentId, setAgentId] = useState("");

  const { data, isLoading, isError } = useLeadsQuery({
    page,
    search,
    stage,
    source,
    agentId,
  });

  const agentsQuery = useAgentsQuery();

  const agents = useMemo<LeadAgentOption[]>(
    () =>
      (agentsQuery.data ?? [])
        .map((agent) => ({
          id: agent.id,
          name: agent.name,
        }))
        .sort((firstAgent, secondAgent) =>
          firstAgent.name.localeCompare(secondAgent.name),
        ),
    [agentsQuery.data],
  );

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

  const handleAgentChange = useCallback((value: string) => {
    setAgentId(value);
    setPage(1);
  }, []);

  const currentPage = data?.meta.current_page ?? 1;
  const lastPage = data?.meta.last_page ?? 1;

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <div className="mb-8">
        <h1 className="text-[34px] font-semibold tracking-[-0.035em] text-[#171717]">
          Leads
        </h1>

        <p className="mt-1.5 text-sm font-normal text-[#747474]">
          Everyone Your Agents Are Working, In One Pipeline.
        </p>
      </div>

      <LeadToolbar
        search={search}
        stage={stage}
        source={source}
        agentId={agentId}
        agents={agents}
        onSearchChange={handleSearchChange}
        onStageChange={handleStageChange}
        onSourceChange={handleSourceChange}
        onAgentChange={handleAgentChange}
      />

      {agentsQuery.isError && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          Failed to load the agent filter options.
        </p>
      )}

      <div className="mt-7">
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-[#e7e7e7] bg-white">
            <p className="text-sm text-[#777777]">Loading leads...</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-72 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
            <p className="text-sm text-red-600">Failed to load leads.</p>
          </div>
        ) : (
          <DataTable
            columns={leadColumns}
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
        )}
      </div>
    </section>
  );
}