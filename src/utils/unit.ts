import type { Unit } from "@/types/unit";

export function getProjectName(unit: Unit): string {
  return (
    unit.project?.name ?? unit.project?.title ?? `Project ${unit.project_id}`
  );
}