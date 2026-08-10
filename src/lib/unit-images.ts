import type { Project } from "@/types/project";
import type { Unit } from "@/types/unit";

/**
 * The backend has no image columns yet, so we render deterministic
 * placeholder photos. Seeding by id keeps a given unit/project showing the
 * same images across renders and pages (no flicker, stable galleries).
 *
 * Swap this file for real `unit.images` / `project.cover_image` once the
 * backend exposes them — nothing else needs to change.
 */
function placeholder(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(
    seed,
  )}/${width}/${height}`;
}

export function getProjectImage(
  project: Pick<Project, "id" | "slug">,
  width = 640,
  height = 420,
): string {
  return placeholder(`project-${project.slug || project.id}`, width, height);
}

export function getUnitCoverImage(
  unit: Pick<Unit, "id" | "code">,
  width = 640,
  height = 420,
): string {
  return placeholder(`unit-${unit.id}-${unit.code}`, width, height);
}

export function getUnitGallery(
  unit: Pick<Unit, "id" | "code">,
  count = 5,
): string[] {
  return Array.from({ length: count }, (_, index) =>
    placeholder(`unit-${unit.id}-${unit.code}-${index}`, 800, 600),
  );
}
