import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/fetcher";
import { useCreateProjectMutation } from "@/hooks/use-create-project-mutation";
import { projectSchema, type ProjectPayload } from "@/schemas/project-schema";

type ProjectFormProps = {
  onSuccess?: () => void;
};

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const createMutation = useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectPayload>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", location: "", description: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Project created");
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not create the project",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="project-name" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <Input
          id="project-name"
          placeholder="Marassi"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="project-location"
          className="mb-2 block text-sm font-medium"
        >
          Location
        </label>
        <Input
          id="project-location"
          placeholder="North Coast"
          {...register("location")}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="project-description"
          className="mb-2 block text-sm font-medium"
        >
          Description <span className="text-[#999999]">(optional)</span>
        </label>
        <textarea
          id="project-description"
          rows={3}
          placeholder="A short description of the project…"
          className="w-full rounded-lg border border-[#e2e2e2] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#cccccc]"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating…" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
