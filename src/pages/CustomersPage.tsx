import { useMemo, useState } from "react";
import { Mail, MapPin, Phone, Search, UsersRound } from "lucide-react";

import { EmptyState } from "@/components/states/EmptyState";
import { useClientsQuery } from "@/hooks/use-clients-query";

export function CustomersPage() {
  const { data, isLoading, isError, refetch } = useClientsQuery();
  const [search, setSearch] = useState("");

  const clients = data?.data ?? [];

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;

    return clients.filter((client) =>
      [client.name, client.email, client.phone]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term)),
    );
  }, [clients, search]);

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#171717]">
            Customers
          </h1>
          <p className="mt-1.5 text-sm text-[#777777]">
            Client records and their contact information.
          </p>
        </div>

        {!isLoading && !isError && clients.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or phone…"
              className="h-10 w-full rounded-xl border border-[#e8e8e8] bg-white pl-9 pr-3 text-sm text-[#333333] outline-none transition focus:border-[#cccccc]"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#222222]" />
            <p className="mt-4 text-sm text-[#777777]">Loading customers…</p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              Failed to load customers.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 text-sm font-medium text-[#3a6df0] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No customers yet"
          description="Client records will appear here once they're added in the backend."
        />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No customers match your search"
          description="Try a different name, email, or phone number."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <article
              key={client.id}
              className="flex flex-col rounded-2xl border border-[#ececec] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9e5dd] text-[13px] font-semibold text-[#5c5647]">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#242424]">
                    {client.name}
                  </p>
                  {client.national_id && (
                    <p className="truncate text-[12px] text-[#8a8a8a]">
                      ID {client.national_id}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-[13px] text-[#555555]">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-[#9a9a9a]" />
                  <span className="truncate">{client.email}</span>
                </p>

                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-[#9a9a9a]" />
                  <span className="truncate">{client.phone ?? "—"}</span>
                </p>

                {client.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9a9a9a]" />
                    <span className="line-clamp-2">{client.address}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
