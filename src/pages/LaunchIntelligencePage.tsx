// Launch Intelligence — Overview dashboard (MARQ tenant).
//
// Wires the five insight endpoints from the AI team's integration guide
// (section 6) into a single read-only market-intelligence screen. Every widget
// is an independent query so a slow or failing endpoint degrades on its own
// instead of blanking the whole page.
//
// Conventions enforced here (guide, section 3):
//   - Money is EGP. min_price is a STARTING price → "from EGP X".
//   - null means unknown, never zero → render "—", never 0.

import {
  BarChart3,
  Building2,
  CalendarRange,
  MapPinned,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

import { IntelTabs } from "@/components/intel/IntelTabs";
import { PageHeader } from "@/components/PageHeader";
import {
  useDeliveryPipelineQuery,
  useMarketShareQuery,
  usePaymentTermsQuery,
  usePriceDistributionQuery,
  useWhitespaceQuery,
  useZonesQuery,
} from "@/hooks/use-intel";
import type {
  DeliveryPipelineRow,
  PriceBracketRow,
} from "@/types/intel";

// ---- formatting helpers -----------------------------------------------------

const egp = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

/** A starting price → "from EGP X"; null/undefined → "—" (never 0). */
function fromPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `from ${egp.format(value)}`;
}

/** A plain price → "EGP X"; null/undefined → "—". */
function price(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return egp.format(value);
}

const pct = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

// ---- shared widget shell ----------------------------------------------------

type WidgetProps = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  className?: string;
  children: ReactNode;
};

function Widget({
  title,
  subtitle,
  icon,
  isLoading,
  isError,
  isEmpty,
  className = "",
  children,
}: WidgetProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <header className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#efede8] text-[#8d7550]">
          {icon}
        </span>

        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </header>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
      ) : isError ? (
        <p className="py-8 text-center text-sm text-red-500">
          Couldn’t load this widget. Please try again later.
        </p>
      ) : isEmpty ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No data yet.
        </p>
      ) : (
        children
      )}
    </section>
  );
}

/** Horizontal bar row used by several widgets. `fraction` is 0..1. */
function Bar({
  label,
  value,
  fraction,
}: {
  label: string;
  value: string;
  fraction: number;
}) {
  const width = `${Math.max(2, Math.round(fraction * 100))}%`;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate text-slate-700">{label}</span>
        <span className="shrink-0 font-medium text-slate-900">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-[#8d7550]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

// ---- normalisers for the two loosely-typed endpoints ------------------------

function bracketLabel(row: PriceBracketRow, index: number): string {
  return row.label ?? row.bracket ?? row.range ?? `Bracket ${index + 1}`;
}
function bracketCount(row: PriceBracketRow): number {
  return row.count ?? row.projects ?? 0;
}
function pipelineYear(row: DeliveryPipelineRow, index: number): string {
  return row.year ?? row.delivery_year ?? `#${index + 1}`;
}
function pipelineCount(row: DeliveryPipelineRow): number {
  return row.projects ?? row.count ?? 0;
}

// ---- competition pill -------------------------------------------------------

const competitionStyles: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

// ---- page -------------------------------------------------------------------

export function LaunchIntelligencePage() {
  const marketShare = useMarketShareQuery(10);
  const zones = useZonesQuery(15);
  const priceDist = usePriceDistributionQuery();
  const pipeline = useDeliveryPipelineQuery();
  const whitespace = useWhitespaceQuery(5, 10);

  const marketRows = marketShare.data?.results ?? [];
  const topShare = marketRows[0]?.market_share_pct ?? 1;

  const zoneRows = zones.data?.results ?? [];

  const priceRows = priceDist.data?.results ?? [];
  const maxBracket = Math.max(1, ...priceRows.map(bracketCount));

  const pipelineRows = pipeline.data?.results ?? [];
  const maxPipeline = Math.max(1, ...pipelineRows.map(pipelineCount));

  const whitespaceRows = whitespace.data?.results ?? [];
  const whitespaceNote = whitespace.data?.note;

  const paymentTerms = usePaymentTermsQuery(12);
  const paymentRows = paymentTerms.data?.results ?? [];

  return (
    <section className="space-y-8">
      <IntelTabs />
      <PageHeader
        title="Launch Intelligence"
        description="Market activity across Nawy and Property Finder — primary & off-plan only. Figures are a research aid, not a valuation."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top developers — market share */}
        <Widget
          title="Top developers"
          subtitle="By share of tracked projects"
          icon={<Building2 size={18} />}
          isLoading={marketShare.isPending}
          isError={marketShare.isError}
          isEmpty={marketRows.length === 0}
        >
          <div className="space-y-4">
            {marketRows.map((row) => (
              <Bar
                key={row.developer_id}
                label={row.developer}
                value={`${pct.format(row.market_share_pct)}%`}
                fraction={row.market_share_pct / topShare}
              />
            ))}
          </div>
        </Widget>

        {/* Price spread — distribution histogram */}
        <Widget
          title="Price spread"
          subtitle="Projects per price bracket (EGP)"
          icon={<BarChart3 size={18} />}
          isLoading={priceDist.isPending}
          isError={priceDist.isError}
          isEmpty={priceRows.length === 0}
        >
          <div className="space-y-4">
            {priceRows.map((row, i) => (
              <Bar
                key={bracketLabel(row, i)}
                label={bracketLabel(row, i)}
                value={String(bracketCount(row))}
                fraction={bracketCount(row) / maxBracket}
              />
            ))}
          </div>
        </Widget>

        {/* Supply pipeline — delivery by year */}
        <Widget
          title="Supply pipeline"
          subtitle="Projects by delivery year"
          icon={<CalendarRange size={18} />}
          isLoading={pipeline.isPending}
          isError={pipeline.isError}
          isEmpty={pipelineRows.length === 0}
        >
          <div className="flex items-end gap-3 pt-2">
            {pipelineRows.map((row, i) => {
              const height = `${Math.max(
                6,
                Math.round((pipelineCount(row) / maxPipeline) * 100),
              )}%`;
              return (
                <div
                  key={pipelineYear(row, i)}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium text-slate-900">
                    {pipelineCount(row)}
                  </span>
                  <div className="flex h-32 w-full items-end">
                    <div
                      className="w-full rounded-t-md bg-[#1c2541]"
                      style={{ height }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {pipelineYear(row, i)}
                  </span>
                </div>
              );
            })}
          </div>
        </Widget>

        {/* Opportunity — whitespace */}
        <Widget
          title="Zones worth a look"
          subtitle="Low-competition heuristic — not investment advice"
          icon={<Sparkles size={18} />}
          isLoading={whitespace.isPending}
          isError={whitespace.isError}
          isEmpty={whitespaceRows.length === 0}
        >
          <div className="space-y-3">
            {whitespaceRows.map((row) => (
              <div
                key={`${row.zone}-${row.city ?? ""}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {row.zone}
                  </p>
                  <p className="text-xs text-slate-500">
                    {row.projects} projects · {row.developers} developers ·{" "}
                    {price(row.median_price)} median
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      competitionStyles[row.competition] ??
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.competition}
                  </span>
                  <span className="text-sm font-semibold text-[#8d7550]">
                    {pct.format(row.opportunity_score * 100)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {whitespaceNote ? (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {whitespaceNote}
            </p>
          ) : null}
        </Widget>
      </div>

      {/* Zone activity — full-width table */}
      <Widget
        title="Zone activity"
        subtitle="Projects, developers and price range by zone"
        icon={<MapPinned size={18} />}
        isLoading={zones.isPending}
        isError={zones.isError}
        isEmpty={zoneRows.length === 0}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4 font-medium">Zone</th>
                <th className="py-2 pr-4 font-medium">City</th>
                <th className="py-2 pr-4 text-right font-medium">Projects</th>
                <th className="py-2 pr-4 text-right font-medium">Developers</th>
                <th className="py-2 pr-4 text-right font-medium">Launches</th>
                <th className="py-2 pl-4 text-right font-medium">
                  Starting price
                </th>
              </tr>
            </thead>
            <tbody>
              {zoneRows.map((row) => (
                <tr
                  key={`${row.zone}-${row.city ?? ""}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-2.5 pr-4 font-medium text-slate-800">
                    {row.zone}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-500">
                    {row.city ?? "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-700">
                    {row.projects}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-700">
                    {row.developers}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-700">
                    {row.launches}
                  </td>
                  <td className="py-2.5 pl-4 text-right text-slate-700">
                    {fromPrice(row.min_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Widget>

      {/* Payment terms — derived from what each source publishes */}
      <Widget
        title="Payment terms by developer"
        subtitle="Only Nawy exposes installment years — a blank there is missing data, not a zero-year plan"
        icon={<Wallet size={18} />}
        isLoading={paymentTerms.isPending}
        isError={paymentTerms.isError}
        isEmpty={paymentRows.length === 0}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4 font-medium">Developer</th>
                <th className="py-2 pr-4 text-right font-medium">Projects</th>
                <th className="py-2 pr-4 text-right font-medium">
                  Avg. down payment
                </th>
                <th className="py-2 pl-4 text-right font-medium">
                  Avg. installment
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentRows.map((row) => (
                <tr
                  key={row.developer}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-2.5 pr-4 font-medium text-slate-800">
                    {row.developer}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-700">
                    {row.projects}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-slate-700">
                    {row.avg_down_payment_pct === null
                      ? "—"
                      : `${pct.format(row.avg_down_payment_pct)}%`}
                  </td>
                  <td className="py-2.5 pl-4 text-right text-slate-700">
                    {row.avg_installment_years === null
                      ? "—"
                      : `${pct.format(row.avg_installment_years)} yrs`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Widget>
    </section>
  );
}
