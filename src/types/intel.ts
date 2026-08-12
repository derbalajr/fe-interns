// Types for the Launch Intelligence API (rnd.addressinv.com).
//
// Copied from the AI team's FRONTEND_INTEGRATION guide, section 4.
//
// NOTE: `min_price`/`median_price` etc. are `number | null`. Null means
// "unknown", never zero — render "—" or "Price on request", never 0.

export type Source = "nawy" | "property_finder";

// ---- GET /insights/market-share ----
export interface MarketShareRow {
  developer_id: string;
  developer: string;
  projects: number;
  market_share_pct: number;
}

// ---- GET /insights/zones ----
export interface ZoneRow {
  zone: string;
  city: string | null;
  projects: number;
  developers: number;
  launches: number;
  min_price: number | null;
  median_price: number | null;
  max_price: number | null;
}

// ---- GET /insights/whitespace ----
export interface WhitespaceRow {
  zone: string;
  city: string | null;
  projects: number;
  developers: number;
  median_price: number | null;
  competition: "low" | "medium" | "high";
  opportunity_score: number; // 0..1 — a heuristic, not a demand signal.
}

// ---- GET /insights/price-distribution ----
// The guide describes this as "5 fixed brackets, always in order" (section 6)
// but the exact field names live in DASHBOARD_API.md, which we don't have yet.
// Kept intentionally loose + defensive; tighten once the schema is confirmed.
export interface PriceBracketRow {
  bracket?: string;
  label?: string;
  range?: string;
  count?: number;
  projects?: number;
}

// ---- GET /insights/delivery-pipeline ----
// "Column chart by year" (section 6). Same caveat as price-distribution.
export interface DeliveryPipelineRow {
  year?: string;
  delivery_year?: string;
  projects?: number;
  count?: number;
}

// ---- GET /insights/payment-terms ----
export interface PaymentTermsRow {
  developer: string;
  projects: number;
  avg_down_payment_pct: number | null;
  // null for a Property-Finder-only developer — only Nawy exposes this. That is
  // missing data, not a zero-year plan (guide, section 6).
  avg_installment_years: number | null;
}

// The insight endpoints return `{ results: [...] }` and may carry a `note`
// (whitespace does — the guide says to surface it).
export interface InsightResponse<TRow> {
  results: TRow[];
  note?: string;
  [key: string]: unknown;
}

// ---- GET /projects ----
export interface ProjectRow {
  project_id: string;
  name: string;
  developer: string | null;
  zone: string | null;
  source: Source;
  min_price: number | null;
  currency: string | null;
  property_types: string[];
  is_launch: boolean;
  delivery_date: string | null; // "2027" or "2027-Q3"
  first_seen_at: string; // ISO UTC
}

export interface ProjectsResponse {
  total: number;
  limit: number;
  offset: number;
  results: ProjectRow[];
}

// ---- GET /projects/{id} ----
export interface UnitSummary {
  count: number;
  min_price: number | null;
  max_price: number | null;
  price_per_sqm_min: number | null;
  price_per_sqm_max: number | null;
  bedrooms: Record<string, number>; // "0" is a studio, not missing.
  property_types: Record<string, number>;
  finishing: Record<string, number>;
}

export interface PriceSnapshot {
  snapshot_at: string;
  min_price: number | null;
  max_price: number | null;
  total_units: number | null;
}

export interface ProjectDetail {
  project: ProjectRow;
  requested_id: string | null; // set when you asked for a duplicate's id.
  units_available_from: Source[];
  units: UnitSummary;
  price_history: PriceSnapshot[]; // oldest-first, often one point.
  also_listed_on: Source[];
}

// ---- GET /launches ----
export interface LaunchEvent {
  kind: "new" | "price_change";
  project_id: string;
  name: string;
  developer: string | null;
  zone: string | null;
  source: Source;
  occurred_at: string;
  min_price: number | null; // 'new' only
  from_price: number | null; // 'price_change' only
  to_price: number | null; // 'price_change' only
  change_pct: number | null; // 'price_change' only
}

export interface LaunchesResponse {
  since: string;
  min_change_pct: number;
  snapshot_runs_in_window: number;
  total: number;
  results: LaunchEvent[];
}

// ---- POST /chat ----
export interface ChatRequest {
  message: string; // 1..2000 chars
  conversation_id?: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
}
