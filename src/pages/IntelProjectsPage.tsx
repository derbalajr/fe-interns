// Launch Intelligence — Project search (MARQ tenant).
//
// Guide, section 6 → "Search and detail". `q` is a substring match on the name;
// debounce it ~300ms. Pagination is limit/offset with a `total` in the response
// (the only endpoints that paginate are /projects and /launches).

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { IntelTabs } from "@/components/intel/IntelTabs";
import { PageHeader } from "@/components/PageHeader";
import { useProjectsQuery } from "@/hooks/use-intel";
import { fromPrice, sourceLabel } from "@/lib/intel-format";

const PAGE_SIZE = 25;

/** Debounce any fast-changing value (used for the search box). */
function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function IntelProjectsPage() {
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const debouncedQuery = useDebounced(query, 300);

  const projects = useProjectsQuery({
    q: debouncedQuery || undefined,
    limit: PAGE_SIZE,
    offset,
  });

  const data = projects.data;
  const rows = data?.results ?? [];
  const total = data?.total ?? 0;

  const { pageStart, pageEnd, canPrev, canNext } = useMemo(() => {
    return {
      pageStart: total === 0 ? 0 : offset + 1,
      pageEnd: Math.min(offset + PAGE_SIZE, total),
      canPrev: offset > 0,
      canNext: offset + PAGE_SIZE < total,
    };
  }, [offset, total]);

  return (
    <section className="space-y-6">
      <IntelTabs />
      <PageHeader
        title="Projects"
        description="Search every tracked primary & off-plan project. Names are matched as a substring."
      />

      {/* Search box */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOffset(0); // new search → back to the first page
          }}
          placeholder="Search projects by name…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 shadow-sm focus:border-[#8d7550] focus:outline-none"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {projects.isPending ? (
          <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
        ) : projects.isError ? (
          <p className="py-12 text-center text-sm text-red-500">
            Couldn’t load projects. Please try again later.
          </p>
        ) : rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">
            No projects match “{debouncedQuery}”.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Developer</th>
                  <th className="px-5 py-3 font-medium">Zone</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Delivery</th>
                  <th className="px-5 py-3 text-right font-medium">
                    Starting price
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.project_id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <Link
                        to={`/insights/projects/${encodeURIComponent(
                          row.project_id,
                        )}`}
                        className="font-medium text-slate-900 hover:text-[#8d7550] hover:underline"
                      >
                        {row.name}
                      </Link>
                      {row.is_launch ? (
                        <span className="ml-2 rounded-full bg-[#efede8] px-2 py-0.5 text-[10px] font-medium text-[#8d7550]">
                          Launch
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {row.developer ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {row.zone ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {sourceLabel(row.source)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {row.delivery_date ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-800">
                      {fromPrice(row.min_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {rows.length > 0 ? (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
            <span>
              {pageStart}–{pageEnd} of {total}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canPrev}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition enabled:hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition enabled:hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
