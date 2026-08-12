import { Building2, CalendarDays, Target, Users } from "lucide-react";

import { PageHeader } from "../components/PageHeader";
import { useTenant } from "@/hooks/use-tenant";
import { useProfileQuery } from "@/hooks/use-profile-query";
import { useProjectsQuery } from "@/hooks/use-projects-query";
import { useReservationsQuery } from "@/hooks/use-reservations-query";
import { useUnitsQuery } from "@/hooks/use-units-query";
import { useHandoversQuery } from "@/hooks/use-handovers-query";

function formatCount(value: number | undefined | null) {
  if (value === undefined || value === null) return "—";
  return value.toLocaleString("en-US");
}

export function DashboardPage() {
  const { tenant } = useTenant();
  const profileQuery = useProfileQuery();
  const projectsQuery = useProjectsQuery();
  const unitsQuery = useUnitsQuery();
  const reservationsQuery = useReservationsQuery();
  const handoversQuery = useHandoversQuery();

  if (profileQuery.isPending) {
    return (
      <div className="rounded-xl border bg-white p-8">
        Loading your workspace...
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        We could not load your profile.
      </div>
    );
  }

  const isMarq = tenant?.id === "marq";
  const projectsTotal = projectsQuery.data?.meta?.total ?? 0;
  const unitsTotal = unitsQuery.data?.meta?.total ?? 0;
  const reservationsTotal = reservationsQuery.data?.meta?.total ?? 0;
  const handoversTotal = handoversQuery.data?.meta?.total ?? 0;

  const units = unitsQuery.data?.data ?? [];
  const statusCounts = units.reduce(
    (acc, unit) => {
      acc[unit.status] = (acc[unit.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const upcomingHandovers = [...(handoversQuery.data?.data ?? [])]
    .sort((a, b) => a.handover_date.localeCompare(b.handover_date))
    .slice(0, 4);

  const recentReservations = [...(reservationsQuery.data?.data ?? [])]
    .sort((a, b) => {
      const aDate = a.reserved_at ?? a.created_at ?? "";
      const bDate = b.reserved_at ?? b.created_at ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, 4);

  return (
    <section className="space-y-8">
      <PageHeader
        title={`Welcome, ${profileQuery.data.name}`}
        description={
          isMarq
            ? "MarQ portfolio overview with live projects, units, reservations, and handovers."
            : "Overview of your CRM activity."
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Projects</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {formatCount(isMarq ? projectsTotal : null)}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={22} />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {isMarq
              ? "Total active projects in the MarQ portfolio."
              : "Overview of the current CRM pipeline."}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Units</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {formatCount(isMarq ? unitsTotal : null)}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Target size={22} />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {isMarq
              ? "Units across current MarQ projects."
              : "Open deals and target units."}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Reservations</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {formatCount(isMarq ? reservationsTotal : null)}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users size={22} />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {isMarq
              ? "Confirmed and pending reservations for MarQ units."
              : "Recent customer and deal activity."}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Handovers</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {formatCount(isMarq ? handoversTotal : null)}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <CalendarDays size={22} />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {isMarq
              ? "Scheduled handovers for reserved or sold MarQ units."
              : "Handovers and delivery milestones."}
          </p>
        </article>
      </div>

      {isMarq ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Unit status</h3>
            <div className="mt-6 space-y-3">
              {[
                { label: "Available", value: statusCounts.available ?? 0 },
                { label: "Reserved", value: statusCounts.reserved ?? 0 },
                { label: "Sold", value: statusCounts.sold ?? 0 },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                  <span className="text-sm text-slate-700">{row.label}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-900">
                    {formatCount(row.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming handovers</h3>
            {handoversQuery.isPending ? (
              <p className="mt-6 text-sm text-slate-400">Loading handovers…</p>
            ) : handoversQuery.isError ? (
              <p className="mt-6 text-sm text-red-500">Could not load handovers.</p>
            ) : upcomingHandovers.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">No scheduled handovers yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {upcomingHandovers.map((handover) => (
                  <div key={handover.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {handover.unit?.code ?? `Unit #${handover.unit_id}`}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {handover.client?.name ?? "Unknown client"}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {handover.handover_date} • {handover.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent reservations</h3>
            {reservationsQuery.isPending ? (
              <p className="mt-6 text-sm text-slate-400">Loading reservations…</p>
            ) : reservationsQuery.isError ? (
              <p className="mt-6 text-sm text-red-500">Could not load reservations.</p>
            ) : recentReservations.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">No reservations yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {recentReservations.map((reservation) => (
                  <div key={reservation.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {reservation.unit?.code ?? `Unit #${reservation.unit_id}`}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {reservation.client?.name ?? "Unknown client"}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {reservation.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">CRM summary</h3>
          <p className="mt-3 text-sm text-slate-500">
            Access MarQ pages to see the project portfolio, units, reservations, and handovers for your workspace.
          </p>
        </div>
      )}
    </section>
  );
}
