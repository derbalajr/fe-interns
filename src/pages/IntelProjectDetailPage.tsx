// Launch Intelligence — Project detail (MARQ tenant).
//
// Guide, section 6 → "Search and detail". Four gotchas handled here:
//   - `requested_id` non-null → the id we asked for was a duplicate that
//     resolved to a canonical project; show a quiet "merged record" note.
//   - `units_available_from: []` → NO source publishes unit data (not "0 units").
//     Hide the unit panel entirely.
//   - `bedrooms` counts from zero — the key "0" is a studio, not missing. A
//     truthiness check would silently drop every studio.
//   - `price_history` is oldest-first and often has one point. One point is not
//     a trend line — render a value, not a chart.

import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";
import { useProjectQuery } from "@/hooks/use-intel";
import { dateOnly, fromPrice, price, sourceLabel } from "@/lib/intel-format";
import type { ProjectDetail } from "@/types/intel";

export function IntelProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const query = useProjectQuery(projectId);

  return (
    <section className="space-y-6">
      <Link
        to="/insights/projects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={15} /> Back to projects
      </Link>

      {query.isPending ? (
        <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
      ) : query.isError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {/* 404 → "Project not found." per the guide's error table. */}
          {(query.error as { status?: number })?.status === 404
            ? "Project not found."
            : "Couldn’t load this project. Please try again later."}
        </p>
      ) : query.data ? (
        <Detail detail={query.data} />
      ) : null}
    </section>
  );
}

function Detail({ detail }: { detail: ProjectDetail }) {
  const { project, requested_id, units_available_from, units, price_history } =
    detail;

  const hasUnitData = units_available_from.length > 0;
  // Studios are keyed "0" — sort numerically and keep the "0" bucket.
  const bedroomEntries = Object.entries(units?.bedrooms ?? {}).sort(
    (a, b) => Number(a[0]) - Number(b[0]),
  );

  return (
    <>
      <PageHeader
        title={project.name}
        description={[project.developer, project.zone]
          .filter(Boolean)
          .join(" · ")}
      />

      {requested_id ? (
        <p className="rounded-xl bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          Showing the merged record — the link you followed pointed to a
          duplicate listing that resolves here.
        </p>
      ) : null}

      {/* Summary facts */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Fact label="Starting price" value={fromPrice(project.min_price)} />
        <Fact label="Delivery" value={project.delivery_date ?? "—"} />
        <Fact label="Primary source" value={sourceLabel(project.source)} />
        <Fact
          label="First seen"
          value={dateOnly(project.first_seen_at)}
        />
      </div>

      {/* Property types + also listed on */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Property types">
          {project.property_types.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.property_types.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">—</p>
          )}
        </Panel>

        <Panel title="Also listed on">
          {detail.also_listed_on.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {detail.also_listed_on.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#efede8] px-3 py-1 text-xs font-medium text-[#8d7550]"
                >
                  {sourceLabel(s)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Not cross-listed on another source.
            </p>
          )}
        </Panel>
      </div>

      {/* Units — hidden entirely when no source publishes unit data. */}
      {hasUnitData ? (
        <Panel
          title="Units"
          subtitle={`Unit data from ${units_available_from
            .map(sourceLabel)
            .join(", ")}`}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Fact label="Units listed" value={String(units.count)} />
            <Fact
              label="Price range"
              value={
                units.min_price === null && units.max_price === null
                  ? "—"
                  : `${price(units.min_price)} – ${price(units.max_price)}`
              }
            />
            <Fact
              label="Price / m²"
              value={
                units.price_per_sqm_min === null &&
                units.price_per_sqm_max === null
                  ? "—"
                  : `${price(units.price_per_sqm_min)} – ${price(
                      units.price_per_sqm_max,
                    )}`
              }
            />
            <Fact
              label="Bedroom types"
              value={String(bedroomEntries.length || "—")}
            />
          </div>

          {bedroomEntries.length > 0 ? (
            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                Bedroom mix
              </p>
              <div className="flex flex-wrap gap-2">
                {bedroomEntries.map(([bed, count]) => (
                  <span
                    key={bed}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700"
                  >
                    {bed === "0" ? "Studio" : `${bed} BR`}:{" "}
                    <span className="font-semibold">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </Panel>
      ) : null}

      {/* Price history — one point is a value, not a trend line. */}
      <Panel title="Price history">
        {price_history.length === 0 ? (
          <p className="text-sm text-slate-400">No price history recorded.</p>
        ) : price_history.length === 1 ? (
          <p className="text-sm text-slate-700">
            {price(price_history[0].min_price)}{" "}
            <span className="text-slate-400">
              (single snapshot on {dateOnly(price_history[0].snapshot_at)} — not
              enough points for a trend)
            </span>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4 font-medium">Snapshot</th>
                  <th className="py-2 pr-4 text-right font-medium">Min</th>
                  <th className="py-2 pr-4 text-right font-medium">Max</th>
                  <th className="py-2 text-right font-medium">Units</th>
                </tr>
              </thead>
              <tbody>
                {price_history.map((snap) => (
                  <tr
                    key={snap.snapshot_at}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-2 pr-4 text-slate-700">
                      {dateOnly(snap.snapshot_at)}
                    </td>
                    <td className="py-2 pr-4 text-right text-slate-700">
                      {price(snap.min_price)}
                    </td>
                    <td className="py-2 pr-4 text-right text-slate-700">
                      {price(snap.max_price)}
                    </td>
                    <td className="py-2 text-right text-slate-700">
                      {snap.total_units ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {subtitle ? (
        <p className="mb-4 mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : (
        <div className="mb-4" />
      )}
      {children}
    </div>
  );
}
