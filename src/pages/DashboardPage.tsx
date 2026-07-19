import { PageHeader } from "../components/PageHeader";
import { useProfileQuery } from "../hooks/use-profile-query";

export function DashboardPage() {
  const profileQuery = useProfileQuery();

  if (profileQuery.isPending) {
    return (
      <div className="rounded-xl border bg-white p-8">
        Loading your workspace...
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        We could not load your profile.
      </div>
    );
  }

  return (
    <section>
      <PageHeader
        title={`Welcome, ${profileQuery.data.name}`}
        description="Overview of your CRM activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total customers
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Open deals
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Tasks due
          </p>

          <p className="mt-2 text-3xl font-bold">
            0
          </p>
        </article>
      </div>
    </section>
  );
}