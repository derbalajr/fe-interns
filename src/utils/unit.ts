import type { Unit, UnitStatus } from "@/types/unit";

export function getProjectName(unit: Unit): string {
  return (
    unit.project?.name ?? unit.project?.title ?? `Project ${unit.project_id}`
  );
}

const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export function getUnitStatusLabel(status: UnitStatus | string): string {
  return (
    UNIT_STATUS_LABELS[status as UnitStatus] ??
    // Capitalise any unexpected/future status the backend might return.
    status.charAt(0).toUpperCase() + status.slice(1)
  );
}

/** Formats the decimal-string area into e.g. "145 M²". */
export function formatUnitArea(area: Unit["area"]): string {
  const numeric = Number(area);

  if (!Number.isFinite(numeric)) {
    return "—";
  }

  return `${numeric.toLocaleString("en-US")} M²`;
}
