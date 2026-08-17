import type { Client } from "@/types/client";
import type { Unit } from "@/types/unit";

export type HandoverStatus = "scheduled" | "completed";

export type Handover = {
  id: number;
  unit_id: number;
  client_id: number;
  handover_date: string;
  status: HandoverStatus;
  notes?: string | null;
  unit?: Unit | null;
  client?: Client | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type HandoverResponse = {
  data: Handover;
};

export type HandoversResponse = {
  data: Handover[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
};
export type CreateHandoverPayload = {
  unit_id: number;
  client_id: number;
  handover_date: string;
  notes?: string | null;
};
