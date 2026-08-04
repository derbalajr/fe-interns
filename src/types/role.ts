export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface RolePermission extends Permission {
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  permissions: RolePermission[];
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
}

export interface RoleResponse {
  success: boolean;
  data: Role;
}

export interface PermissionsResponse {
  success: boolean;
  data: Permission[];
}