export interface AssignableUser {
  id: number;
  name: string;
  email: string;
  tenant: string | null;
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  data: AssignableUser[];
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}
