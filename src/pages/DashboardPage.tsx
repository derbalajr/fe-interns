// src/pages/DashboardPage.tsx
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Target,
  Users,
} from "lucide-react";

import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const profileQuery = useProfileQuery();
 console.log(JSON.stringify(profileQuery.data, null, 2));

  if (isLoadingUser && !user) {
    return (
      <div className="rounded-xl border bg-white p-8">
        Loading your workspace...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        We could not load your profile.
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <PageHeader
        title={`Welcome, ${profileQuery.data.data.name}`}
        description="Overview of your CRM activity."
      />

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Leads",
            value: 124,
            icon: Users,
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Open Deals",
            value: 18,
            icon: Target,
            color: "bg-amber-50 text-amber-600",
          },
          {
            title: "Customers",
            value: 67,
            icon: Building2,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            title: "Revenue",
            value: "$94K",
            icon: DollarSign,
            color: "bg-purple-50 text-purple-600",
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <card.icon size={22} />
              </div>
            </div>

            <p className="mt-4 text-xs text-emerald-600">
              ↑ Updated today
            </p>
          </article>
        ))}
      </div>

      {/* Bottom */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold">
            Pipeline Overview
          </h3>

          <div className="mt-6 space-y-5">
            {[
              ["New Leads", "75%"],
              ["Qualified", "55%"],
              ["Proposal", "35%"],
              ["Closed", "20%"],
            ].map(([label, width]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{label}</span>
                  <span>{width}</span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-[#8d7550]"
                    style={{ width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Recent Activity
          </h3>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 text-emerald-500"
              />
              <span>Lead "Ahmed Ali" was created.</span>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 text-blue-500"
              />
              <span>Deal moved to Qualified.</span>
            </div>

            <div className="flex items-start gap-3">
              <Clock3
                size={18}
                className="mt-0.5 text-amber-500"
              />
              <span>Follow-up due at 3:00 PM.</span>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays
                size={18}
                className="mt-0.5 text-purple-500"
              />
              <span>Property visit tomorrow.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">
          Quick Actions
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-xl bg-[#1c2541] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
            + New Lead
          </button>

          <button className="rounded-xl border px-5 py-3 text-sm font-medium transition hover:bg-slate-50">
            + Create Deal
          </button>

          <button className="rounded-xl border px-5 py-3 text-sm font-medium transition hover:bg-slate-50">
            Schedule Meeting
          </button>

          <button className="rounded-xl border px-5 py-3 text-sm font-medium transition hover:bg-slate-50">
            Ask Keystone AI
          </button>
        </div>
      </div>
    </section>
  );
}