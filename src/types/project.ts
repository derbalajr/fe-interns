export type Project = {
  id: number;
  name: string;
  slug: string;
  location: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProjectResponse = {
  data: Project;
};

export type ProjectsResponse = {
  data: Project[];
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
