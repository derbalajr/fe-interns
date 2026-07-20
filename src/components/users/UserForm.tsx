import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateUserMutation } from "@/hooks/use-create-user-mutation";
import { useUpdateUserMutation } from "@/hooks/use-update-user-mutation";
import {
  userSchema,
  type UserFormValues,
} from "@/schemas/user-schema";
import type { User } from "@/types/user";

type UserFormProps = {
  user?: User;
  onSuccess?: () => void;
};

export function UserForm({
  user,
  onSuccess,
}: UserFormProps) {
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Agent",
      status: "Active",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (user) {
      await updateMutation.mutateAsync({
        id: user.id,
        data: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    reset();

    onSuccess?.();
  });

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
      noValidate
    >
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Name
        </label>

        <Input
          id="name"
          {...register("name")}
          placeholder="John Doe"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john@example.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-sm font-medium"
        >
          Role
        </label>

        <select
          id="role"
          {...register("role")}
          className="h-10 w-full rounded-md border bg-background px-3"
        >
          <option value="Manager">Manager</option>
          <option value="Agent">Agent</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium"
        >
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
        <Button
          type="submit"
          disabled={isPending}
        >
          {user ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </form>
  );
}