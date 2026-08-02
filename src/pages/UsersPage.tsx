import { useMemo, useState } from "react";

import { ChevronDown, Plus, Search } from "lucide-react";

import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { DataTable } from "@/components/data-table/DataTable";
import { getUserColumns } from "@/components/data-table/userColumns";
import { Button } from "@/components/ui/button";
import { useUsersQuery } from "@/hooks/use-users-query";
import { getUserRoleName, getUserStatus } from "@/lib/user";
import type { User } from "@/types/user";

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 appearance-none rounded-full border border-[#e5e5e5] bg-white py-2 pr-9 pl-4 text-[13px] text-[#4c4c4c] outline-none focus:border-[#d0ccc2]"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
    </div>
  );
}

export default function UsersPage() {
  const { data = [], isLoading, isError } = useUsersQuery();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [positionFilter, setPositionFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const positionOptions = useMemo(() => {
    const names = new Set<string>();
    data.forEach((user) => {
      if (user.position) {
        names.add(user.position);
      }
    });
    return Array.from(names).sort();
  }, [data]);

  // Role options come from the actual data so the filter always matches.
  const roleOptions = useMemo(() => {
    const names = new Set<string>();
    data.forEach((user) => {
      const name = getUserRoleName(user);
      if (name) {
        names.add(name);
      }
    });
    return Array.from(names).sort();
  }, [data]);

  const agents = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || getUserRoleName(user) === roleFilter;

      const matchesStatus =
        statusFilter === "All" || getUserStatus(user) === statusFilter;

      const matchesPosition =
        positionFilter === "All" || user.position === positionFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesPosition;
    });
  }, [data, search, roleFilter, statusFilter, positionFilter]);

  const columns = useMemo(
    () => getUserColumns((user) => setSelectedUser(user)),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#242424]">
          Agents
        </h1>
        <p className="mt-1 text-[13px] text-[#8a8a8a]">
          Your Agents Are Working, In One Pipeline.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
          <input
            placeholder="Search Agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-[#e5e5e5] bg-white pr-4 pl-10 text-[13px] text-[#4c4c4c] outline-none placeholder:text-[#9a9a9a] focus:border-[#d0ccc2]"
          />
        </div>

        <FilterSelect value={statusFilter} onChange={setStatusFilter}>
          <option value="All">Status: All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </FilterSelect>

        <FilterSelect value={roleFilter} onChange={setRoleFilter}>
          <option value="All">Role: All</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect value={positionFilter} onChange={setPositionFilter}>
          <option value="All">Position: All</option>
          {positionOptions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </FilterSelect>

        <CreateUserDialog
          trigger={
            <Button className="h-10 gap-2 rounded-full bg-[#242424] px-5 text-[13px] hover:bg-[#333333]">
              <Plus className="h-4 w-4" />
              New Agent
            </Button>
          }
        />
      </div>

      {/* Agents Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-sm text-[#8a8a8a]">
          Loading agents...
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-20 text-sm text-rose-500">
          Failed to load agents.
        </div>
      ) : (
        <DataTable columns={columns} data={agents} />
      )}

      {/* Edit Dialog */}
      <EditUserDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
