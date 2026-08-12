// Shared formatting for Launch Intelligence screens.
//
// Enforces the guide's section-3 conventions in one place so no screen can
// accidentally coerce a null price to 0 or drop the EGP label.

const egp = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

/** A plain price → "EGP X"; null/undefined → "—" (never 0). */
export function price(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return egp.format(value);
}

/** A starting price → "from EGP X"; null/undefined → "—". */
export function fromPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `from ${egp.format(value)}`;
}

const numberFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/** A percentage number → "12.5%"; null/undefined → "—". */
export function percent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${numberFmt.format(value)}%`;
}

/** ISO UTC timestamp → local date-time; falsy → "—". Egypt is UTC+2/+3. */
export function dateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** ISO UTC timestamp → local date only; falsy → "—". */
export function dateOnly(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export const SOURCE_LABEL: Record<string, string> = {
  nawy: "Nawy",
  property_finder: "Property Finder",
};

export function sourceLabel(source: string | null | undefined): string {
  if (!source) return "—";
  return SOURCE_LABEL[source] ?? source;
}
