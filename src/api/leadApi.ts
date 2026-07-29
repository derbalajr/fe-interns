import {
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from "@/lib/fetcher";

import type { LeadPayload } from "@/schemas/lead-schema";
import type {
  LeadResponse,
  LeadsResponse,
} from "@/types/lead";

export type UpdateLeadPayload = LeadPayload;

export type AssignLeadPayload = {
  agent_id: number | null;
};

export type ChangeLeadStagePayload = {
  stage: string;
};

type GetLeadsParams = {
  page?: number;
  search?: string;
  stage?: string;
  source?: string;
  agentId?: string;
};

const PER_PAGE = 100;

export function getLeads({
  page = 1,
  search = "",
  stage = "",
  source = "",
  agentId = "",
}: GetLeadsParams = {}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("per_page", String(PER_PAGE));

  if (search.trim()) {
    params.set("q", search.trim());
  }

  if (stage) {
    params.set("stage", stage);
  }

  if (source) {
    params.set("source", source);
  }

  if (agentId) {
    params.set("agent_id", agentId);
  }

  return apiGet<LeadsResponse>(
    `/leads?${params.toString()}`,
  );
}

export function getLead(id: number | string) {
  return apiGet<LeadResponse>(`/leads/${id}`);
}

export function createLead(data: LeadPayload) {
  return apiPost<LeadResponse, LeadPayload>(
    "/leads",
    data,
  );
}

export function updateLead(
  id: number,
  data: UpdateLeadPayload,
) {
  return apiPut<LeadResponse, UpdateLeadPayload>(
    `/leads/${id}`,
    data,
  );
}

export function assignLead(
  id: number,
  data: AssignLeadPayload,
) {
  return apiPatch<LeadResponse, AssignLeadPayload>(
    `/leads/${id}/assign`,
    data,
  );
}

export function changeLeadStage(
  id: number,
  data: ChangeLeadStagePayload,
) {
  return apiPatch<
    LeadResponse,
    ChangeLeadStagePayload
  >(`/leads/${id}/stage`, data);
}