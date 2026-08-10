import { CalendarClock } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { useCan } from "@/hooks/use-can";
import { useReservationsQuery } from "@/hooks/use-reservations-query";
import { useCancelReservationMutation } from "@/hooks/use-cancel-reservation-mutation";
import type { Reservation, ReservationStatus } from "@/types/reservation";
import { getProjectName } from "@/utils/unit";

const STATUS_STYLES: Record<ReservationStatus, string> = {
  pending: "bg-[#fdf1dc] text-[#b7791f]",
  confirmed: "bg-[#e7f6ec] text-[#1f9d55]",
  cancelled: "bg-[#fdecec] text-[#d64545]",
};

function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize",
        STATUS_STYLES[status] ?? "bg-[#eeeeee] text-[#555555]",
      )}
    >
      {status}
    </span>
  );
}

export function ReservationsPage() {
  const { can } = useCan();
  const { data, isLoading, isError, refetch } = useReservationsQuery();
  const cancelReservation = useCancelReservationMutation();

  const reservations = data?.data ?? [];
  const canCancel = can("cancel-reservations");

  const handleCancel = (reservation: Reservation) => {
    cancelReservation.mutate(reservation.id, {
      onSuccess: () => toast.success("Reservation cancelled."),
      onError: (error: unknown) => {
        const message =
          error instanceof ApiError
            ? error.message
            : "Could not cancel this reservation.";
        toast.error(message);
      },
    });
  };

  return (
    <section className="mx-auto w-full max-w-[1180px]">
      <div className="mb-7">
        <h1 className="text-[34px] font-semibold tracking-[-0.04em] text-[#171717]">
          Reservations
        </h1>
        <p className="mt-1.5 text-sm text-[#777777]">
          Units currently held for your clients.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#dddddd] border-t-[#222222]" />
            <p className="mt-4 text-sm text-[#777777]">Loading reservations…</p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              Failed to load reservations.
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
      ) : reservations.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No reservations yet"
          description="Reserve an available unit for a client and it will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <article
              key={reservation.id}
              className="flex flex-col rounded-2xl border border-[#ececec] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#242424]">
                    {reservation.unit
                      ? `${getProjectName(reservation.unit)} — ${reservation.unit.code}`
                      : `Unit #${reservation.unit_id}`}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-[#8a8a8a]">
                    {reservation.client?.name ??
                      `Client #${reservation.client_id}`}
                  </p>
                </div>

                <ReservationStatusBadge status={reservation.status} />
              </div>

              <p className="mt-4 text-lg font-semibold text-[#171717]">
                {formatCurrency(Number(reservation.reserved_price))}
              </p>

              {canCancel && reservation.status !== "cancelled" && (
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={cancelReservation.isPending}
                    onClick={() => handleCancel(reservation)}
                    className="h-8 rounded-lg px-3 text-xs text-[#d64545] hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
