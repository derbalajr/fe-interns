import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/fetcher";
import { useCreateUnitMutation } from "@/hooks/use-create-unit-mutation";
import { useProjectsQuery } from "@/hooks/use-projects-query";
import {
  unitSchema,
  type UnitFormValues,
  type UnitPayload,
} from "@/schemas/unit-schema";

const UNIT_TYPES = ["Apartment", "Townhouse", "Villa", "Chalet", "Studio"];

const fieldClassName =
  "h-10 w-full rounded-lg border border-[#e2e2e2] bg-white px-3 text-sm outline-none transition focus:border-[#cccccc]";

type UnitFormProps = {
  defaultProjectId?: number;
  lockProject?: boolean;
  onSuccess?: () => void;
};

export function UnitForm({
  defaultProjectId,
  lockProject = false,
  onSuccess,
}: UnitFormProps) {
  const createMutation = useCreateUnitMutation();
  const projectsQuery = useProjectsQuery();
  const projects = projectsQuery.data?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitFormValues, unknown, UnitPayload>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      project_id: defaultProjectId ?? "",
      code: "",
      type: "",
      area: "",
      price: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Unit created");
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not create the unit",
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="unit-project" className="mb-2 block text-sm font-medium">
          Project
        </label>
        <select
          id="unit-project"
          className={fieldClassName}
          disabled={lockProject}
          {...register("project_id")}
        >
          <option value="">Select a project…</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {errors.project_id && (
          <p className="mt-1 text-sm text-red-500">
            {errors.project_id.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit-code" className="mb-2 block text-sm font-medium">
            Code
          </label>
          <Input id="unit-code" placeholder="V204" {...register("code")} />
          {errors.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="unit-type" className="mb-2 block text-sm font-medium">
            Type
          </label>
          <select id="unit-type" className={fieldClassName} {...register("type")}>
            <option value="">Select a type…</option>
            {UNIT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit-area" className="mb-2 block text-sm font-medium">
            Area (M²)
          </label>
          <Input
            id="unit-area"
            type="number"
            step="0.01"
            placeholder="320"
            {...register("area")}
          />
          {errors.area && (
            <p className="mt-1 text-sm text-red-500">{errors.area.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="unit-price" className="mb-2 block text-sm font-medium">
            Price (EGP)
          </label>
          <Input
            id="unit-price"
            type="number"
            step="0.01"
            placeholder="14200000"
            {...register("price")}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating…" : "Create Unit"}
        </Button>
      </div>
    </form>
  );
}
