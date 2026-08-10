import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/format";
import { useClientsQuery } from "@/hooks/use-clients-query";
import { useCreateReservationMutation } from "@/hooks/use-create-reservation-mutation";
import type { Unit } from "@/types/unit";
import { getProjectName } from "@/utils/unit";

type ReserveUnitDialogProps = {
  unit: Unit;
  open: boolean;
  onClose: () => void;
  onReserved?: () => void;
};

export function ReserveUnitDialog({
  unit,
  open,
  onClose,
  onReserved,
}: ReserveUnitDialogProps) {
  const [clientId, setClientId] = useState("");

  // Only fetch clients while the dialog is open.
  const clientsQuery = useClientsQuery({ enabled: open });
  const createReservation = useCreateReservationMutation();

  if (!open) {
    return null;
  }

  const clients = clientsQuery.data?.data ?? [];

  const handleSubmit = () => {
    if (!clientId) {
      toast.error("Please select a client.");
      return;
    }

    createReservation.mutate(
      { unit_id: unit.id, client_id: Number(clientId) },
      {
        onSuccess: () => {
          toast.success(`Unit ${unit.code} reserved.`);
          setClientId("");
          onReserved?.();
          onClose();
        },
        onError: (error: unknown) => {
          const message =
            error instanceof ApiError
              ? error.message
              : "Could not reserve this unit.";
          toast.error(message);
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              Reserve unit
            </h2>
            <p className="mt-1 text-sm text-[#777777]">
              {getProjectName(unit)} — {unit.code}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-[#999999] transition hover:bg-[#f2f2f2] hover:text-[#333333]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-[#f7f7f7] px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#777777]">Unit price</span>
            <span className="font-semibold text-[#171717]">
              {formatCurrency(Number(unit.price))}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="reserve-client"
            className="mb-1.5 block text-sm font-medium text-[#333333]"
          >
            Client
          </label>

          {clientsQuery.isLoading ? (
            <p className="text-sm text-[#999999]">Loading clients…</p>
          ) : clientsQuery.isError ? (
            <p className="text-sm text-red-600">Failed to load clients.</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-[#999999]">
              No clients available. Add a client first.
            </p>
          ) : (
            <select
              id="reserve-client"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#e8e8e8] bg-white px-3 text-sm text-[#333333] outline-none transition focus:border-[#cccccc]"
            >
              <option value="">Select a client…</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              createReservation.isPending || !clientId || clients.length === 0
            }
            className="h-10 rounded-xl px-4 text-sm"
          >
            {createReservation.isPending ? "Reserving…" : "Reserve unit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
