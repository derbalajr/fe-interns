import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { CreateLeadDialog } from "@/components/leads/CreateLeadDialog";
import { Input } from "@/components/ui/input";

export type LeadAgentOption = {
  id: number;
  name: string;
};

interface LeadToolbarProps {
  search: string;
  stage: string;
  source: string;
  agentId: string;
  agents: LeadAgentOption[];
  onSearchChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onAgentChange: (value: string) => void;
}

const selectClassName =
  "h-11 min-w-[120px] rounded-xl border border-[#ededed] bg-[#fafafa] px-4 text-sm text-[#666666] shadow-[0_2px_8px_rgba(0,0,0,0.035)] outline-none transition focus:border-[#d6d6d6]";

export function LeadToolbar({
  search,
  stage,
  source,
  agentId,
  agents,
  onSearchChange,
  onStageChange,
  onSourceChange,
  onAgentChange,
}: LeadToolbarProps) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchValue, onSearchChange]);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative w-full sm:w-[210px]">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]"
        />

        <Input
          type="search"
          aria-label="Search leads"
          placeholder="Search Leads..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-11 rounded-xl border-[#ededed] bg-[#fafafa] pl-10 text-sm text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.035)] placeholder:text-[#9a9a9a] focus-visible:border-[#d6d6d6] focus-visible:ring-0"
        />
      </div>

      <select
        aria-label="Filter leads by stage"
        value={stage}
        onChange={(event) => onStageChange(event.target.value)}
        className={selectClassName}
      >
        <option value="">Stage: All</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="unqualified">Unqualified</option>
      </select>

      <select
        aria-label="Filter leads by source"
        value={source}
        onChange={(event) => onSourceChange(event.target.value)}
        className={selectClassName}
      >
        <option value="">Source: All</option>
        <option value="website">Website</option>
        <option value="referral">Referral</option>
        <option value="linkedin">LinkedIn</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
        <option value="social_media">Social Media</option>
        <option value="phone_call">Phone Call</option>
        <option value="walk_in">Walk In</option>
      </select>

      <select
        aria-label="Filter leads by assigned agent"
        value={agentId}
        onChange={(event) => onAgentChange(event.target.value)}
        className={selectClassName}
      >
        <option value="">Agent: All</option>

        {agents.map((agent) => (
          <option key={agent.id} value={String(agent.id)}>
            {agent.name}
          </option>
        ))}
      </select>

      <CreateLeadDialog />
    </div>
  );
}