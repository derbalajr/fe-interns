import { apiGet, apiPatch, apiPost, apiPut } from "@/lib/fetcher";

import type { LeadPayload } from "@/schemas/lead-schema";
import type { LeadResponse, LeadsResponse } from "@/types/lead";

export type UpdateLeadPayload = LeadPayload;
export type AssignLeadPayload = {
  agent_id: number | null;
};

export function getLeads(page = 1, search = "", stage = "", source = "") {
  const params = new URLSearchParams();

  params.set("page", page.toString());

  if (search) {
    params.set("search", search);
  }

  if (stage) {
    params.set("stage", stage);
  }

  if (source) {
    params.set("source", source);
  }

  return apiGet<LeadsResponse>(`/leads?${params.toString()}`);
}

export function getLead(id: number | string) {
  return apiGet<LeadResponse>(`/leads/${id}`);
}

export function createLead(data: LeadPayload) {
  return apiPost<LeadResponse, LeadPayload>("/leads", data);
}

export function updateLead(id: number, data: UpdateLeadPayload) {
  return apiPut<LeadResponse, UpdateLeadPayload>(`/leads/${id}`, data);
}

export function assignLead(id: number, data: AssignLeadPayload) {
  return apiPatch<LeadResponse, AssignLeadPayload>(`/leads/${id}/assign`, data);
}
