import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "@/lib/fetcher";

import type { RolePayload } from "@/schemas/role-schema";

import type {
  PermissionsResponse,
  RoleResponse,
  RolesResponse,
} from "@/types/role";

export function getRoles() {
  return apiGet<RolesResponse>("/roles");
}

export function getPermissions() {
  return apiGet<PermissionsResponse>("/permissions");
}

export function createRole(data: RolePayload) {
  return apiPost<RoleResponse, RolePayload>("/roles", data);
}

export function updateRole(
  id: number,
  data: RolePayload,
) {
  return apiPut<RoleResponse, RolePayload>(
    `/roles/${id}`,
    data,
  );
}

export function deleteRole(id: number) {
  return apiDelete(`/roles/${id}`);
}