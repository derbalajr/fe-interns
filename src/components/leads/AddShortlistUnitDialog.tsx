import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddShortlistUnitMutation } from "@/hooks/use-add-shortlist-unit-mutation";
import { useUnitsQuery } from "@/hooks/use-units-query";
import type { Unit } from "@/types/unit";
import { getProjectName } from "@/utils/unit";

type AddShortlistUnitDialogProps = {
  leadId: number;
  shortlistedUnits: Unit[];
};

export function AddShortlistUnitDialog({
  leadId,
  shortlistedUnits,
}: AddShortlistUnitDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState("");

  const unitsQuery = useUnitsQuery();
  const addMutation = useAddShortlistUnitMutation();

  const shortlistedIds = useMemo(
    () => new Set(shortlistedUnits.map((unit) => unit.id)),
    [shortlistedUnits],
  );

  const availableUnits = useMemo(
    () =>
      (unitsQuery.data ?? []).filter(
        (unit) => unit.status === "available" && !shortlistedIds.has(unit.id),
      ),
    [shortlistedIds, unitsQuery.data],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSelectedUnitId("");
      addMutation.reset();
    }
  };

  const handleSubmit = async () => {
    const unitId = Number(selectedUnitId);

    if (!Number.isInteger(unitId)) {
      return;
    }

    try {
      await addMutation.mutateAsync({
        leadId,
        unitId,
      });

      handleOpenChange(false);
    } catch {
      // The mutation error is rendered inside the dialog.
    }
  };

  const errorMessage =
    addMutation.error instanceof Error ? addMutation.error.message : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add Unit
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Unit to Shortlist</DialogTitle>

          <DialogDescription>
            Select an available inventory unit for this lead.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {unitsQuery.isLoading ? (
            <p className="text-sm text-slate-500">Loading units...</p>
          ) : unitsQuery.isError ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {unitsQuery.error instanceof Error
                ? unitsQuery.error.message
                : "Failed to load units."}
            </p>
          ) : availableUnits.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              There are no available units to add.
            </p>
          ) : (
            <div className="space-y-2">
              <label htmlFor="shortlist-unit" className="text-sm font-medium">
                Unit
              </label>

              <Select
                value={selectedUnitId}
                onValueChange={(value) => {
                  if (value !== null) {
                    setSelectedUnitId(value);
                  }
                }}
                disabled={addMutation.isPending}
              >
                <SelectTrigger id="shortlist-unit">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>

                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={String(unit.id)}>
                      {unit.code} · {unit.type} · {getProjectName(unit)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={addMutation.isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                !selectedUnitId || addMutation.isPending || unitsQuery.isLoading
              }
              onClick={handleSubmit}
            >
              {addMutation.isPending ? "Adding..." : "Add to Shortlist"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}