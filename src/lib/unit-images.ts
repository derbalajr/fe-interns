import type { Project } from "@/types/project";
import type { Unit } from "@/types/unit";

/**
 * Units expose real photos via `unit.photos` (uploaded files or seeded URLs).
 * When a unit has none, we fall back to a deterministic placeholder seeded by
 * id/code so the same unit always shows the same image (no flicker).
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
  unit: Pick<Unit, "id" | "code" | "photos">,
  width = 640,
  height = 420,
): string {
  const cover = unit.photos?.[0]?.url;
  if (cover) {
    return cover;
  }

  return placeholder(`unit-${unit.id}-${unit.code}`, width, height);
}

export function getUnitGallery(
  unit: Pick<Unit, "id" | "code" | "photos">,
  count = 5,
): string[] {
  const real = unit.photos?.map((photo) => photo.url) ?? [];

  if (real.length >= count) {
    return real.slice(0, count);
  }

  // Top up with stable placeholders so the gallery always has `count` slots.
  const fillers = Array.from({ length: count - real.length }, (_, index) =>
    placeholder(`unit-${unit.id}-${unit.code}-${real.length + index}`, 800, 600),
  );

  return [...real, ...fillers];
}
