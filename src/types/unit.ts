export type UnitStatus = "available" | "reserved" | "sold";

export type UnitProject = {
  id: number;
  name?: string;
  title?: string;
  location?: string | null;
};

export type UnitPhoto = {
  id: number;
  url: string;
};

export type Unit = {
  id: number;
  code: string;
  type: string;
  area: string | number;
  price: string | number;
  status: UnitStatus;
  project_id: number;
  project: UnitProject | null;
  photos?: UnitPhoto[];
  floor_plans?: UnitPhoto[];
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
  meta: {
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