export type Client = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  national_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ClientsResponse = {
  data: Client[];
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
