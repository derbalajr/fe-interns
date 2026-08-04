import { useMemo, useState } from "react";

import { Plus, Search } from "lucide-react";

import { CreateRoleDialog } from "@/components/roles/CreateRoleDialog";
import { EditRoleDialog } from "@/components/roles/EditRoleDialog";

import { DataTable } from "@/components/data-table/DataTable";
import { getRoleColumns } from "@/components/data-table/roleColumns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useRolesQuery } from "@/hooks/use-roles-query";

import type { Role } from "@/types/role";
import { DeleteRoleDialog } from "@/components/roles/DeleteRoleDialog";

export default function RolesPage() {
  const { data = [], isLoading, isError } = useRolesQuery();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const roles = useMemo(() => {
    return data.filter((role) =>
      role.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const columns = useMemo(
    () =>
      getRoleColumns(
        (role) => setSelectedRole(role),
        (role) => setRoleToDelete(role),
      ),
    [],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading roles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>

          <p className="mt-1 text-muted-foreground">
            Manage roles and their permissions.
          </p>
        </div>

        <CreateRoleDialog
          trigger={
            <Button className="gap-2">
              <Plus size={18} />
              New Role
            </Button>
          }
        />
      </div>

      {/* Search */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={roles} />

      {/* Edit Dialog */}
      <EditRoleDialog
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
      />
      <DeleteRoleDialog
        role={roleToDelete}
        onClose={() => setRoleToDelete(null)}
      />
    </div>
  );
}
