import type { Client } from "@/types/client";
import type { Unit } from "@/types/unit";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type ReservationAgent = {
  id: number;
  name: string;
  email?: string;
};

export type Reservation = {
  id: number;
  unit_id: number;
  client_id: number;
  agent_id: number;
  status: ReservationStatus;
  reserved_price: string | number;
  reserved_at: string | null;
  unit?: Unit | null;
  client?: Client | null;
  agent?: ReservationAgent | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ReservationResponse = {
  data: Reservation;
};

export type ReservationsResponse = {
  data: Reservation[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type CreateReservationPayload = {
  unit_id: number;
  client_id: number;
};
