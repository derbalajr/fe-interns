export type PriceRangeKey =
  | "any"
  | "under-5m"
  | "5m-10m"
  | "10m-15m"
  | "over-15m";

/**
 * UI price presets mapped to the backend `min_price` / `max_price` filter
 * params (see be-interns FilterUnitRequest).
 */
export const PRICE_RANGES: Record<
  PriceRangeKey,
  { label: string; minPrice?: number; maxPrice?: number }
> = {
  any: { label: "Price: Any" },
  "under-5m": { label: "Under EGP 5M", maxPrice: 5_000_000 },
  "5m-10m": {
    label: "EGP 5M – 10M",
    minPrice: 5_000_000,
    maxPrice: 10_000_000,
  },
  "10m-15m": {
    label: "EGP 10M – 15M",
    minPrice: 10_000_000,
    maxPrice: 15_000_000,
  },
  "over-15m": { label: "Over EGP 15M", minPrice: 15_000_000 },
};
