import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateRoleMutation } from "@/hooks/use-create-role-mutation";
import { usePermissionsQuery } from "@/hooks/use-permissions-query";
import { useUpdateRoleMutation } from "@/hooks/use-update-role-mutation";

import { roleSchema, type RolePayload } from "@/schemas/role-schema";

import type { Role } from "@/types/role";

type RoleFormProps = {
  role?: Role;
  onSuccess?: () => void;
};

export function RoleForm({ role, onSuccess }: RoleFormProps) {
  const createMutation = useCreateRoleMutation();
  const updateMutation = useUpdateRoleMutation();

  const { data: permissions = [] } = usePermissionsQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RolePayload>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        permissions: role.permissions.map((permission) => permission.name),
      });
    } else {
      reset({
        name: "",
        permissions: [],
      });
    }
  }, [role, reset]);

  const selectedPermissions = watch("permissions");

  const togglePermission = (permissionName: string) => {
    if (selectedPermissions.includes(permissionName)) {
      setValue(
        "permissions",
        selectedPermissions.filter(
          (permission) => permission !== permissionName,
        ),
      );
    } else {
      setValue("permissions", [...selectedPermissions, permissionName]);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (role) {
        await updateMutation.mutateAsync({
          id: role.id,
          data: values,
        });
        toast.success("Role updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Role created");
      }

      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Role Name
        </label>

        <Input id="name" placeholder="Manager" {...register("name")} />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium">Permissions</label>

        <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-4">
          {permissions.map((permission) => (
            <label
              key={permission.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission.name)}
                onChange={() => togglePermission(permission.name)}
                className="h-4 w-4"
              />

              <span className="text-sm">{permission.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {role ? "Save Changes" : "Create Role"}
        </Button>
      </div>
    </form>
  );
}
