import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateUserMutation } from "@/hooks/use-create-user-mutation";
import { useUpdateUserMutation } from "@/hooks/use-update-user-mutation";
import { useRolesQuery } from "@/hooks/use-roles-query";
import { createUserSchema, updateUserSchema, type UserFormValues } from "@/schemas/user-schema";
import { getUserRoleId, getUserStatus } from "@/lib/user";
import type { User } from "@/types/user";

type UserFormProps = {
  user?: User;
  onSuccess?: () => void;
};

export function UserForm({ user, onSuccess }: UserFormProps) {
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: user ? "" : undefined,
      role_id: undefined,
      status: "Active",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        role_id: getUserRoleId(user),
        status: getUserStatus(user),
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      // The backend models account state as an `active` boolean, not a status
      // string. Tenant is assigned server-side from the creator, so we don't
      // send it from here.
      const active = values.status === "Active";

      if (user) {
        await updateMutation.mutateAsync({
          id: user.id,
          data: {
            name: values.name,
            email: values.email,
            role_id: values.role_id,
            active,
            ...(values.password
              ? {
                  password: values.password,
                  password_confirmation: values.password_confirmation,
                }
              : {}),
          },
        });
        toast.success("User updated");
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
          role_id: values.role_id,
          active,
        });
        toast.success("User created");
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
          Name
        </label>

        <Input id="name" {...register("name")} placeholder="John Doe" />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>

        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john@example.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role_id" className="mb-2 block text-sm font-medium">
          Role
        </label>

        <select
          id="role_id"
          {...register("role_id", {
            setValueAs: (value) =>
              value === "" || value === null || value === undefined
                ? undefined
                : Number(value),
          })}
          className="h-10 w-full rounded-md border bg-background px-3"
          disabled={isLoadingRoles}
        >
          <option value="">Select a role</option>
          {Array.isArray(roles) && roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {errors.role_id && (
          <p className="mt-1 text-sm text-red-500">{errors.role_id.message}</p>
        )}
      </div>

      {!user && (
        <>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>

            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <Input
              id="password_confirmation"
              type="password"
              {...register("password_confirmation")}
              placeholder="••••••••"
            />

            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-500">{errors.password_confirmation.message}</p>
            )}
          </div>
        </>
      )}

      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Status
        </label>

        <select
          id="status"
          {...register("status")}
          className="h-10 w-full rounded-md border bg-background px-3"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {user ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
