import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { useCreateHandoverMutation } from "@/hooks/use-create-handover-mutation";
import { useClientsQuery } from "@/hooks/use-clients-query";
import { useUnitsQuery } from "@/hooks/use-units-query";

type ScheduleHandoverDialogProps = {
  open: boolean;
  onClose: () => void;
};

type FormErrors = {
  unitId?: string;
  clientId?: string;
  handoverDate?: string;
};

function getLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function ScheduleHandoverDialog({
  open,
  onClose,
}: ScheduleHandoverDialogProps) {
  const createHandoverMutation = useCreateHandoverMutation();

  const {
    data: clientsData,
    isLoading: clientsLoading,
    isError: clientsError,
  } = useClientsQuery({
    enabled: open,
  });

  const {
    data: reservedUnitsData,
    isLoading: reservedUnitsLoading,
    isError: reservedUnitsError,
  } = useUnitsQuery({
    status: "reserved",
    enabled: open,
  });

  const {
    data: soldUnitsData,
    isLoading: soldUnitsLoading,
    isError: soldUnitsError,
  } = useUnitsQuery({
    status: "sold",
    enabled: open,
  });

  const [unitId, setUnitId] = useState("");
  const [clientId, setClientId] = useState("");
  const [handoverDate, setHandoverDate] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const clients = clientsData?.data ?? [];

  const eligibleUnits = useMemo(() => {
    const reserved = reservedUnitsData?.data ?? [];
    const sold = soldUnitsData?.data ?? [];

    const units = [...reserved, ...sold];

    return units.filter(
      (unit, index, allUnits) =>
        allUnits.findIndex((currentUnit) => currentUnit.id === unit.id) ===
        index,
    );
  }, [reservedUnitsData, soldUnitsData]);

  const unitsLoading = reservedUnitsLoading || soldUnitsLoading;

  const unitsError = reservedUnitsError || soldUnitsError;

  if (!open) {
    return null;
  }

  function validateForm() {
    const newErrors: FormErrors = {};

    if (!unitId) {
      newErrors.unitId = "Please select a unit.";
    }

    if (!clientId) {
      newErrors.clientId = "Please select a client.";
    }

    if (!handoverDate) {
      newErrors.handoverDate = "Handover date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setUnitId("");
    setClientId("");
    setHandoverDate("");
    setNotes("");
    setErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    createHandoverMutation.mutate(
      {
        unit_id: Number(unitId),
        client_id: Number(clientId),
        handover_date: handoverDate,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[560px] rounded-2xl border border-[#ededed] bg-[#fbfbfb] p-6 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-medium text-black">
              Schedule Handover
            </h2>

            <p className="mt-1 text-sm text-[#626262]">
              Schedule a handover for a reserved or sold unit.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#626262]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Unit */}
          <div>
            <label
              htmlFor="handover-unit"
              className="mb-2 block text-sm font-medium text-black"
            >
              Unit
            </label>

            <select
              id="handover-unit"
              value={unitId}
              disabled={unitsLoading || unitsError}
              onChange={(event) => {
                setUnitId(event.target.value);

                setErrors((current) => ({
                  ...current,
                  unitId: undefined,
                }));
              }}
              className="h-12 w-full rounded-xl border border-[#dedede] bg-white px-4 text-sm text-black outline-none focus:border-[#9c9c9c] disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
            >
              <option value="">
                {unitsLoading ? "Loading units..." : "Select a unit"}
              </option>

              {eligibleUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.code}
                  {unit.project?.name
                    ? ` - ${unit.project.name}`
                    : unit.project?.title
                      ? ` - ${unit.project.title}`
                      : ""}
                  {` (${unit.status})`}
                </option>
              ))}
            </select>

            {errors.unitId && (
              <p className="mt-1 text-sm text-red-600">{errors.unitId}</p>
            )}

            {unitsError && (
              <p className="mt-1 text-sm text-red-600">Failed to load units.</p>
            )}

            {!unitsLoading && !unitsError && eligibleUnits.length === 0 && (
              <p className="mt-1 text-sm text-[#626262]">
                No reserved or sold units are available.
              </p>
            )}
          </div>

          {/* Client */}
          <div>
            <label
              htmlFor="handover-client"
              className="mb-2 block text-sm font-medium text-black"
            >
              Client
            </label>

            <select
              id="handover-client"
              value={clientId}
              disabled={clientsLoading || clientsError}
              onChange={(event) => {
                setClientId(event.target.value);

                setErrors((current) => ({
                  ...current,
                  clientId: undefined,
                }));
              }}
              className="h-12 w-full rounded-xl border border-[#dedede] bg-white px-4 text-sm text-black outline-none focus:border-[#9c9c9c] disabled:cursor-not-allowed disabled:bg-[#f3f3f3]"
            >
              <option value="">
                {clientsLoading ? "Loading clients..." : "Select a client"}
              </option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>

            {errors.clientId && (
              <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
            )}

            {clientsError && (
              <p className="mt-1 text-sm text-red-600">
                Failed to load clients.
              </p>
            )}

            {!clientsLoading && !clientsError && clients.length === 0 && (
              <p className="mt-1 text-sm text-[#626262]">
                No clients are available.
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="handover-date"
              className="mb-2 block text-sm font-medium text-black"
            >
              Handover Date
            </label>

            <input
              id="handover-date"
              type="date"
              value={handoverDate}
              min={getLocalDateString(new Date())}
              onChange={(event) => {
                setHandoverDate(event.target.value);

                setErrors((current) => ({
                  ...current,
                  handoverDate: undefined,
                }));
              }}
              className="h-12 w-full rounded-xl border border-[#dedede] bg-white px-4 text-sm text-black outline-none focus:border-[#9c9c9c]"
            />

            {errors.handoverDate && (
              <p className="mt-1 text-sm text-red-600">{errors.handoverDate}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="handover-notes"
              className="mb-2 block text-sm font-medium text-black"
            >
              Notes
              <span className="ml-1 font-normal text-[#9c9c9c]">
                (optional)
              </span>
            </label>

            <textarea
              id="handover-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add notes"
              rows={4}
              className="w-full resize-none rounded-xl border border-[#dedede] bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#9c9c9c]"
            />
          </div>

          {/* API Error */}
          {createHandoverMutation.isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to schedule handover. Please check the selected unit,
              client, and date and try again.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 rounded-xl border border-[#dedede] bg-white px-5 text-sm font-medium text-[#626262]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createHandoverMutation.isPending ||
                unitsLoading ||
                clientsLoading ||
                unitsError ||
                clientsError
              }
              className="h-11 rounded-xl bg-black/80 px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createHandoverMutation.isPending
                ? "Scheduling..."
                : "Schedule Handover"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
