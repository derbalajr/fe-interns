import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CreateLeadDialog } from "@/components/leads/CreateLeadDialog";
import { Input } from "@/components/ui/input";

interface LeadToolbarProps {
  search: string;
  stage: string;
  source: string;
  onSearchChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

export function LeadToolbar({
  search,
  stage,
  source,
  onSearchChange,
  onStageChange,
  onSourceChange,
}: LeadToolbarProps) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchValue, onSearchChange]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full md:w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search Leads..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-white pl-10 shadow-none"
          />
        </div>

        <select
          value={stage}
          onChange={(event) => onStageChange(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none transition focus:border-slate-400"
        >
          <option value="">Stage: All</option>
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          value={source}
          onChange={(event) => onSourceChange(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none transition focus:border-slate-400"
        >
          <option value="">Source: All</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
        </select>

        <div className="flex-1" />

        <CreateLeadDialog />
      </div>
    </div>
  );
}
