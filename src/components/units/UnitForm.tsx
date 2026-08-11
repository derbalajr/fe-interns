import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/fetcher";
import { useCreateUnitMutation } from "@/hooks/use-create-unit-mutation";
import { useUpdateUnitMutation } from "@/hooks/use-update-units-mutation";
import { useProjectsQuery } from "@/hooks/use-projects-query";
import {
  unitSchema,
  type UnitFormValues,
  type UnitPayload,
} from "@/schemas/unit-schema";
import type { Unit, UnitPhoto } from "@/types/unit";

const UNIT_TYPES = [
  "Apartment",
  "Townhouse",
  "Villa",
  "Chalet",
  "Studio",
];

const fieldClassName =
  "h-10 w-full rounded-lg border border-[#e2e2e2] bg-white px-3 text-sm outline-none transition focus:border-[#cccccc]";

type NewPhoto = {
  id: string;
  file: File;
  preview: string;
};

type UnitFormProps = {
  mode?: "create" | "edit";
  unit?: Unit;
  defaultProjectId?: number;
  lockProject?: boolean;
  onSuccess: () => void;
};

export function UnitForm({
  mode = "create",
  unit,
  defaultProjectId,
  lockProject = false,
  onSuccess,
}: UnitFormProps) {
  const isEdit = mode === "edit";

  const createMutation = useCreateUnitMutation();
  const updateMutation = useUpdateUnitMutation();

  const projectsQuery = useProjectsQuery();
  const projects = projectsQuery.data?.data ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [existingPhotos, setExistingPhotos] = useState<UnitPhoto[]>(
    unit?.photos ?? [],
  );

  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitFormValues, unknown, UnitPayload>({
    resolver: zodResolver(unitSchema),

    defaultValues: {
      project_id: unit?.project_id ?? defaultProjectId ?? "",
      code: unit?.code ?? "",
      type: unit?.type ?? "",
      area: unit?.area ?? "",
      price: unit?.price ?? "",
    },
  });

  useEffect(() => {
    if (!isEdit || !unit) {
      return;
    }

    reset({
      project_id: unit.project_id,
      code: unit.code,
      type: unit.type,
      area: unit.area,
      price: unit.price,
    });

    setExistingPhotos(unit.photos ?? []);
    setNewPhotos([]);
  }, [isEdit, unit, reset]);

  /*
   * Add selected files and create local previews.
   */
  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const photos = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewPhotos((current) => [...current, ...photos]);

    // Allow selecting the same file again later.
    event.target.value = "";
  };

  /*
   * Remove a new photo before submitting.
   */
  const removeNewPhoto = (id: string) => {
    setNewPhotos((current) => {
      const photo = current.find((item) => item.id === id);

      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  /*
   * Remove an existing photo from the list.
   *
   * The backend will see that its ID was not sent
   * and delete the media record + physical file.
   */
  const removeExistingPhoto = (id: number) => {
    setExistingPhotos((current) =>
      current.filter((photo) => photo.id !== id),
    );
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      /*
       * EDIT
       */
      if (isEdit && unit) {
        const formData = new FormData();

        formData.append(
          "project_id",
          String(values.project_id),
        );

        formData.append("code", values.code);
        formData.append("type", values.type);
        formData.append("area", String(values.area));
        formData.append("price", String(values.price));

        /*
         * Existing photos that were kept.
         */
        existingPhotos.forEach((photo, index) => {
          formData.append(
            `media[${index}][id]`,
            String(photo.id),
          );

          formData.append(
            `media[${index}][type]`,
            "photo",
          );
        });

        /*
         * New photos.
         */
        newPhotos.forEach((photo, index) => {
          const mediaIndex = existingPhotos.length + index;

          formData.append(
            `media[${mediaIndex}][type]`,
            "photo",
          );

          formData.append(
            `media[${mediaIndex}][file]`,
            photo.file,
          );
        });

        await updateMutation.mutateAsync({
          id: unit.id,
          data: formData,
        });

        toast.success("Unit updated");

        newPhotos.forEach((photo) => {
          URL.revokeObjectURL(photo.preview);
        });

        onSuccess();
        return;
      }

      /*
       * CREATE
       *
       * Your existing create endpoint already supports
       * photos, so we send FormData here too.
       */
      const formData = new FormData();

      formData.append(
        "project_id",
        String(values.project_id),
      );

      formData.append("code", values.code);
      formData.append("type", values.type);
      formData.append("area", String(values.area));
      formData.append("price", String(values.price));

      newPhotos.forEach((photo) => {
        formData.append("photos[]", photo.file);
      });

      await createMutation.mutateAsync(
        formData as unknown as UnitPayload,
      );

      toast.success("Unit created");

      newPhotos.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });

      setNewPhotos([]);
      reset();

      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : isEdit
            ? "Could not update the unit"
            : "Could not create the unit",
      );
    }
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
      noValidate
    >
      {/* Project */}
      <div>
        <label
          htmlFor="unit-project"
          className="mb-2 block text-sm font-medium"
        >
          Project
        </label>

        <select
          id="unit-project"
          className={fieldClassName}
          disabled={lockProject || isPending}
          {...register("project_id")}
        >
          <option value="">
            Select a project…
          </option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
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

      {/* Code + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="unit-code"
            className="mb-2 block text-sm font-medium"
          >
            Code
          </label>

          <Input
            id="unit-code"
            placeholder="V204"
            disabled={isPending}
            {...register("code")}
          />

          {errors.code && (
            <p className="mt-1 text-sm text-red-500">
              {errors.code.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="unit-type"
            className="mb-2 block text-sm font-medium"
          >
            Type
          </label>

          <select
            id="unit-type"
            className={fieldClassName}
            disabled={isPending}
            {...register("type")}
          >
            <option value="">
              Select a type…
            </option>

            {UNIT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {errors.type && (
            <p className="mt-1 text-sm text-red-500">
              {errors.type.message}
            </p>
          )}
        </div>
      </div>

      {/* Area + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="unit-area"
            className="mb-2 block text-sm font-medium"
          >
            Area (M²)
          </label>

          <Input
            id="unit-area"
            type="number"
            step="0.01"
            placeholder="320"
            disabled={isPending}
            {...register("area")}
          />

          {errors.area && (
            <p className="mt-1 text-sm text-red-500">
              {errors.area.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="unit-price"
            className="mb-2 block text-sm font-medium"
          >
            Price (EGP)
          </label>

          <Input
            id="unit-price"
            type="number"
            step="0.01"
            placeholder="14200000"
            disabled={isPending}
            {...register("price")}
          />

          {errors.price && (
            <p className="mt-1 text-sm text-red-500">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      {/* Photos */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium">
            Photos
          </label>

          <span className="text-xs text-[#888888]">
            JPG, PNG, WEBP
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />

        <button
          type="button"
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d8d8d8] px-4 py-5 text-sm text-[#666666] transition hover:border-[#aaaaaa] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImagePlus className="h-5 w-5" />
          Add photos
        </button>

        {(existingPhotos.length > 0 || newPhotos.length > 0) && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {/* Existing photos */}
            {existingPhotos.map((photo) => (
              <div
                key={`existing-${photo.id}`}
                className="group relative overflow-hidden rounded-xl border border-[#e5e5e5]"
              >
                <img
                  src={photo.url}
                  alt="Unit"
                  className="aspect-square w-full object-cover"
                />

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    removeExistingPhoto(photo.id)
                  }
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* New photos */}
            {newPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-xl border border-[#e5e5e5]"
              >
                <img
                  src={photo.preview}
                  alt={photo.file.name}
                  className="aspect-square w-full object-cover"
                />

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => removeNewPhoto(photo.id)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? isEdit
              ? "Saving…"
              : "Creating…"
            : isEdit
              ? "Save Changes"
              : "Create Unit"}
        </Button>
      </div>
    </form>
  );
}