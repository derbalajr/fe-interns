import type {
  LeadSource,
  LeadStage,
} from "@/schemas/lead-schema";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  stage: LeadStage;
  budget: number | null;
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

export interface LeadResponse {
  data: Lead;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface LeadsResponse {
  data: Lead[];
  links: PaginationLink[];
  meta: PaginationMeta;
}