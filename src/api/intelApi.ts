// Client for the Launch Intelligence API (rnd.addressinv.com).
//
// This talks to a DIFFERENT service than the CRM's own Laravel API (that one
// lives behind VITE_API_URL and uses a Bearer token). This one:
//   - has its own base URL (VITE_INTEL_API_URL)
//   - authenticates with an `X-API-Key` header (VITE_INTEL_API_KEY)
//   - is read-only JSON for every endpoint we use here
//
// SECURITY CAVEAT (from the guide, section 2): the API key is a single shared
// secret with no expiry. Shipping it in a VITE_ var means it lands in the
// browser bundle and is readable by anyone with devtools. The guide says the
// key must live on a server-side proxy. We're deliberately deferring that to
// match the existing chat-agent.ts pattern — move both behind a Laravel proxy
// before this goes public.

import type {
  ChatResponse,
  DeliveryPipelineRow,
  InsightResponse,
  LaunchesResponse,
  MarketShareRow,
  PaymentTermsRow,
  PriceBracketRow,
  ProjectDetail,
  ProjectsResponse,
  Source,
  WhitespaceRow,
  ZoneRow,
} from "@/types/intel";

const INTEL_API_URL = import.meta.env.VITE_INTEL_API_URL?.replace(/\/$/, "");
const INTEL_API_KEY = import.meta.env.VITE_INTEL_API_KEY;

export class IntelApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "IntelApiError";
    this.status = status;
  }
}

/** Thrown at call time (not import time) so the rest of the app still loads. */
function assertConfig(): { url: string; key: string } {
  if (!INTEL_API_URL) {
    throw new IntelApiError(
      "VITE_INTEL_API_URL is missing. Add it to .env.local.",
      0,
    );
  }
  if (!INTEL_API_KEY) {
    throw new IntelApiError(
      "VITE_INTEL_API_KEY is missing. Add it to .env.local.",
      0,
    );
  }
  return { url: INTEL_API_URL, key: INTEL_API_KEY };
}

async function intelGet<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const { url, key } = assertConfig();

  const search = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined) search.set(name, String(value));
  }
  const query = search.toString();
  const target = `${url}${path.startsWith("/") ? path : `/${path}`}${
    query ? `?${query}` : ""
  }`;

  let response: Response;
  try {
    response = await fetch(target, { headers: { "X-API-Key": key } });
  } catch {
    // Network / CORS failure — surfaced as a distinct message for the UI.
    throw new IntelApiError("Could not reach the Launch Intelligence API.", 0);
  }

  if (!response.ok) {
    // The guide (section 5): `detail` is written for developers — log it, don't
    // render it. We keep it on the error for logging but the UI shows generic copy.
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) detail = body.detail;
    } catch {
      /* non-JSON error body — keep the default */
    }
    throw new IntelApiError(detail, response.status);
  }

  return (await response.json()) as T;
}

async function intelPost<T>(path: string, body: unknown): Promise<T> {
  const { url, key } = assertConfig();
  const target = `${url}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(target, {
      method: "POST",
      headers: {
        "X-API-Key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new IntelApiError("Could not reach the Launch Intelligence API.", 0);
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const errBody = (await response.json()) as { detail?: string };
      if (errBody?.detail) detail = errBody.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new IntelApiError(detail, response.status);
  }

  return (await response.json()) as T;
}

// ---- Overview dashboard endpoints (guide, section 6) ----

export function getMarketShare(limit = 10) {
  return intelGet<InsightResponse<MarketShareRow>>("/insights/market-share", {
    limit,
  });
}

export function getZones(limit = 15) {
  return intelGet<InsightResponse<ZoneRow>>("/insights/zones", { limit });
}

export function getPriceDistribution() {
  return intelGet<InsightResponse<PriceBracketRow>>(
    "/insights/price-distribution",
  );
}

export function getDeliveryPipeline() {
  return intelGet<InsightResponse<DeliveryPipelineRow>>(
    "/insights/delivery-pipeline",
  );
}

export function getWhitespace(minProjects = 5, limit = 10) {
  return intelGet<InsightResponse<WhitespaceRow>>("/insights/whitespace", {
    min_projects: minProjects,
    limit,
  });
}

export function getPaymentTerms(limit = 15) {
  return intelGet<InsightResponse<PaymentTermsRow>>(
    "/insights/payment-terms",
    { limit },
  );
}

// ---- Change feed (guide, section 6 → "Change feed") ----

export interface LaunchesParams {
  since?: string; // e.g. "7d" — default the UI to this (guide's advice).
  min_change_pct?: number;
  limit?: number;
  source?: Source;
  zone?: string;
}

export function getLaunches(params: LaunchesParams = {}) {
  return intelGet<LaunchesResponse>("/launches", {
    since: params.since ?? "7d",
    min_change_pct: params.min_change_pct,
    limit: params.limit ?? 50,
    source: params.source,
    zone: params.zone,
  });
}

// ---- Search & detail (guide, section 6 → "Search and detail") ----

export interface ProjectsParams {
  q?: string;
  source?: Source;
  zone?: string;
  min_price?: number;
  max_price?: number;
  limit?: number; // max 200, default 50
  offset?: number;
}

export function getProjects(params: ProjectsParams = {}) {
  return intelGet<ProjectsResponse>("/projects", {
    q: params.q,
    source: params.source,
    zone: params.zone,
    min_price: params.min_price,
    max_price: params.max_price,
    limit: params.limit ?? 50,
    offset: params.offset ?? 0,
  });
}

export function getProject(id: string) {
  return intelGet<ProjectDetail>(`/projects/${encodeURIComponent(id)}`);
}

// ---- Chat (guide, section 8) ----
// Echo `conversation_id` back on every follow-up or each turn starts fresh.
export function postChat(message: string, conversationId?: string) {
  return intelPost<ChatResponse>("/chat", {
    message,
    conversation_id: conversationId,
  });
}
