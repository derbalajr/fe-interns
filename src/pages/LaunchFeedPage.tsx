// Launch Intelligence — Change feed (MARQ tenant).
//
// Guide, section 6 → "Change feed". Two rules baked in here:
//   - Default the window to `since=7d`; a window reaching 6 Aug 2026 reports
//     every project as "new" (catalogue rebuild).
//   - Read `snapshot_runs_in_window` BEFORE showing an empty state. 0 or 1 runs
//     means "not enough history yet", NOT "no activity" — a very different and
//     more alarming claim to put in front of a client.
//
// The feed is grouped by `kind` into two lists, which reads far better than one
// interleaved stream.

import { ArrowDownRight, ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { IntelTabs } from "@/components/intel/IntelTabs";
import { PageHeader } from "@/components/PageHeader";
import { useLaunchesQuery } from "@/hooks/use-intel";
import { dateTime, fromPrice, price, sourceLabel } from "@/lib/intel-format";
import type { LaunchEvent } from "@/types/intel";

const WINDOWS = [
  { label: "24 hours", value: "1d" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
] as const;

export function LaunchFeedPage() {
  const [since, setSince] = useState<string>("7d");
  const [minChangePct, setMinChangePct] = useState<number>(5);

  const launches = useLaunchesQuery({
    since,
    min_change_pct: minChangePct,
    limit: 50,
  });

  const data = launches.data;
  const events = data?.results ?? [];
  const newEvents = events.filter((e) => e.kind === "new");
  const priceEvents = events.filter((e) => e.kind === "price_change");

  // "Not enough history" vs "no activity" — see file header.
  const notEnoughHistory =
    data !== undefined && (data.snapshot_runs_in_window ?? 0) <= 1;

  return (
    <section className="space-y-8">
      <IntelTabs />
      <PageHeader
        title="Change feed"
        description="New projects and price movements across Nawy and Property Finder."
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Window</span>
          <div className="flex rounded-xl border border-slate-200 p-1">
            {WINDOWS.map((w) => (
              <button
                key={w.value}
                type="button"
                onClick={() => setSince(w.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  since === w.value
                    ? "bg-[#e9e5dd] text-[#242424]"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          Min price change
          <select
            value={minChangePct}
            onChange={(e) => setMinChangePct(Number(e.target.value))}
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800"
          >
            {[0, 5, 10, 20].map((v) => (
              <option key={v} value={v}>
                {v}%
              </option>
            ))}
          </select>
        </label>
      </div>

      {launches.isPending ? (
        <p className="py-12 text-center text-sm text-slate-400">
          Loading the feed…
        </p>
      ) : launches.isError ? (
        <p className="py-12 text-center text-sm text-red-500">
          Couldn’t load the change feed. Please try again later.
        </p>
      ) : (
        <>
          {notEnoughHistory ? (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Not enough collection history in this window yet to detect price
              movement. As snapshot runs accumulate, changes will appear here —
              this is not the same as “no activity”.
            </p>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* New this week */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <Sparkles size={16} className="text-[#8d7550]" />
                New in window ({newEvents.length})
              </h3>
              {newEvents.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
                  No new projects in this window.
                </p>
              ) : (
                <ul className="space-y-3">
                  {newEvents.map((e) => (
                    <NewCard key={`${e.project_id}-${e.occurred_at}`} event={e} />
                  ))}
                </ul>
              )}
            </div>

            {/* Price changes */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <TrendingUp size={16} className="text-[#8d7550]" />
                Price changes ({priceEvents.length})
              </h3>
              {priceEvents.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
                  No price changes in this window.
                </p>
              ) : (
                <ul className="space-y-3">
                  {priceEvents.map((e) => (
                    <PriceCard
                      key={`${e.project_id}-${e.occurred_at}`}
                      event={e}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function EventShell({
  event,
  children,
}: {
  event: LaunchEvent;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/insights/projects/${encodeURIComponent(event.project_id)}`}
            className="truncate text-sm font-semibold text-slate-900 hover:text-[#8d7550] hover:underline"
          >
            {event.name}
          </Link>
          <p className="mt-0.5 text-xs text-slate-500">
            {event.developer ?? "Unknown developer"}
            {event.zone ? ` · ${event.zone}` : ""} ·{" "}
            {sourceLabel(event.source)}
          </p>
        </div>
        <span className="shrink-0 text-[11px] text-slate-400">
          {dateTime(event.occurred_at)}
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </li>
  );
}

function NewCard({ event }: { event: LaunchEvent }) {
  return (
    <EventShell event={event}>
      <span className="text-sm font-medium text-slate-800">
        {fromPrice(event.min_price)}
      </span>
    </EventShell>
  );
}

function PriceCard({ event }: { event: LaunchEvent }) {
  const up = (event.change_pct ?? 0) >= 0;
  return (
    <EventShell event={event}>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-400 line-through">
          {price(event.from_price)}
        </span>
        <span className="font-medium text-slate-900">
          {price(event.to_price)}
        </span>
        {event.change_pct !== null ? (
          <span
            className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              up ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(event.change_pct).toFixed(1)}%
          </span>
        ) : null}
      </div>
    </EventShell>
  );
}
