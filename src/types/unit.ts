export type UnitStatus = "available" | "reserved" | "sold";

export type UnitProject = {
  id: number;
  name?: string;
  title?: string;
};

export type Unit = {
  id: number;
  code: string;
  type: string;
  area: number;
  price: number;
  status: UnitStatus;
  project_id: number;
  project: UnitProject | null;
  created_at: string;
  updated_at: string;
};

export type UnitResponse = {
  data: Unit;
};

export type UnitsResponse = {
  data: Unit[];
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

export type DeleteShortlistUnitResponse = {
  message: string;
};
