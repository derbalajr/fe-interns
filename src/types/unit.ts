export type Unit = {
  id: number;
  code: string;
  type: string;
  area: number;
  price: number;
  status: string;
  project_id: number;
  created_at: string;
  updated_at: string;
};

export type UnitResponse = {
  data: Unit;
};

export type UnitsResponse = {
  data: Unit[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};