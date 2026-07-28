import type { DealStage } from "@/schemas/deal-schema";

export interface Deal {
  id: number;
  lead_id: number;
  unit_id: number | null;
  agent_id: number;

  stage: DealStage;
  value: number;
  expected_close: string | null;

  lead: {
    id: number;
    name: string;
  } | null;

  unit: {
    id: number;
    code: string;
  } | null;

  agent: {
    id: number;
    name: string;
    email: string;
  } | null;

  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number |null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface DealResponse {
  data: Deal;
}

export interface DealsResponse {
  data: Deal[];
  links: PaginationLink[];
  meta: PaginationMeta;
}