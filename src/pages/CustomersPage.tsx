import { CustomerFormDemo } from "@/components/form/CustomerFormDemo";

import { PageHeader } from "../components/PageHeader";

export function CustomersPage() {
  return (
    <section>
      <PageHeader
        title="Customers"
        description="Manage customers and their contact information."
      />

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          No customers yet
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Customer records will appear here.
        </p>

        <button
          type="button"
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Add customer
        </button>
      </div>
      <div className="space-y-8">
      {/* Existing page content */}

      {import.meta.env.DEV && <CustomerFormDemo />}
    </div>
    </section>
  );
}