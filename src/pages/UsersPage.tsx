import { useMemo, useState } from "react";

import { Plus, Search } from "lucide-react";

import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { DataTable } from "@/components/data-table/DataTable";
import { getUserColumns } from "@/components/data-table/userColumns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsersQuery } from "@/hooks/use-users-query";
import type { User } from "@/types/user";

export default function UsersPage() {
  const { data = [], isLoading, isError } = useUsersQuery();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [data, search, roleFilter, statusFilter]);

  const columns = useMemo(
    () =>
      getUserColumns((user) => {
        setSelectedUser(user);
      }),
    [],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>

          <p className="mt-1 text-muted-foreground">
            Manage your CRM users and permissions.
          </p>
        </div>

        <CreateUserDialog
          trigger={
            <Button className="gap-2">
              <Plus size={18} />
              New User
            </Button>
          }
        />
      </div>

      {/* Toolbar */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="All">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Agent">Agent</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <DataTable columns={columns} data={users} />

      {/* Edit Dialog */}
      <EditUserDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
