import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
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

import type { Unit } from "@/types/unit";

const UNIT_TYPES = [
  "Apartment",
  "Townhouse",
  "Villa",
  "Chalet",
  "Studio",
];

const fieldClassName =
  "h-10 w-full rounded-lg border border-[#e2e2e2] bg-white px-3 text-sm outline-none transition focus:border-[#cccccc]";

type ExistingPhoto = {
  id: number;
  url: string;
};

type NewPhoto = {
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

  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = isEdit ? updateMutation : createMutation;

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
      area: unit?.area != null ? String(unit.area) : "",
      price: unit?.price != null ? String(unit.price) : "",
    },
  });

  /*
   * When editing, load the unit's existing photos.
   */
  useEffect(() => {
    if (isEdit && unit) {
      setExistingPhotos(
        unit.photos?.map((photo) => ({
          id: photo.id,
          url: photo.url,
        })) ?? [],
      );

      reset({
        project_id: unit.project_id,
        code: unit.code,
        type: unit.type,
        area: String(unit.area),
        price: String(unit.price),
      });
    }
  }, [isEdit, unit, reset]);

  /*
   * Clean up object URLs when the component is unmounted.
   */
  useEffect(() => {
    return () => {
      newPhotos.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, [newPhotos]);

  /*
   * Handle selecting photos.
   */
  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const validFiles: NewPhoto[] = [];

    for (const file of files) {
      const isImage = file.type.startsWith("image/");

      if (!isImage) {
        toast.error(`${file.name} is not an image.`);
        continue;
      }

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error(`${file.name} is larger than 5MB.`);
        continue;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setNewPhotos((current) => [...current, ...validFiles]);

    /*
     * Reset the input so selecting the same file again works.
     */
    event.target.value = "";
  };

  /*
   * Remove a newly selected photo.
   */
  const removeNewPhoto = (index: number) => {
    setNewPhotos((current) => {
      const photo = current[index];

      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }

      return current.filter((_, photoIndex) => photoIndex !== index);
    });
  };

  /*
   * Remove an existing photo from the edit form.
   *
   * We don't delete it immediately from the backend.
   * We simply remove it from the list that will be submitted.
   */
  const removeExistingPhoto = (id: number) => {
    setExistingPhotos((current) =>
      current.filter((photo) => photo.id !== id),
    );
  };

  /*
   * Submit create/edit request.
   */
  const onSubmit = handleSubmit(async (values) => {
    try {
      const formData = new FormData();

      /*
       * CREATE
       */
      if (!isEdit) {
        formData.append(
          "project_id",
          String(values.project_id),
        );

        formData.append("code", values.code);
        formData.append("type", values.type);
        formData.append("area", String(values.area));
        formData.append("price", String(values.price));

        /*
         * Laravel StoreUnitRequest expects:
         *
         * photos[]
         */
        newPhotos.forEach((photo) => {
          formData.append("photos[]", photo.file);
        });

        await createMutation.mutateAsync(formData);

        toast.success("Unit created");

        newPhotos.forEach((photo) => {
          URL.revokeObjectURL(photo.preview);
        });

        setNewPhotos([]);
        reset();

        onSuccess();

        return;
      }

      /*
       * EDIT
       */
      if (!unit) {
        toast.error("Unit information is missing.");
        return;
      }

      /*
       * Laravel method spoofing.
       *
       * We send POST multipart/form-data with _method=PUT
       * because this allows Laravel/PHP to properly receive
       * uploaded files.
       */
      formData.append("_method", "PUT");

      formData.append(
        "project_id",
        String(values.project_id),
      );

      formData.append("code", values.code);
      formData.append("type", values.type);
      formData.append("area", String(values.area));
      formData.append("price", String(values.price));

      /*
       * Tell the backend which existing media we are keeping.
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
       * Add newly uploaded photos.
       *
       * Example:
       * media[2][type] = photo
       * media[2][file] = actual image
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

      setNewPhotos([]);

      onSuccess();
    } catch (error) {
      if (error instanceof ApiError) {
        /*
         * Show Laravel validation errors if available.
         */
        if (error.errors) {
          const firstError = Object.values(error.errors)
            .flat()[0];

          toast.error(firstError ?? error.message);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(
          isEdit
            ? "Could not update the unit"
            : "Could not create the unit",
        );
      }
    }
  });

  const isPending = mutation.isPending;

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
          disabled={lockProject || projectsQuery.isLoading}
          {...register("project_id")}
        >
          <option value="">
            {projectsQuery.isLoading
              ? "Loading projects…"
              : "Select a project…"}
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

        {projectsQuery.isError && (
          <p className="mt-1 text-sm text-red-500">
            Could not load projects.
          </p>
        )}

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
            {...register("type")}
          >
            <option value="">
              Select a type…
            </option>

            {UNIT_TYPES.map((type) => (
              <option
                key={type}
                value={type}
              >
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

          <span className="text-xs text-[#999999]">
            JPG, PNG, WEBP · Max 5MB
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
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d8d8d8] px-4 py-6 text-sm text-[#777777] transition hover:border-[#aaaaaa] hover:bg-[#fafafa]"
        >
          <ImagePlus className="h-5 w-5" />
          Add photos
        </button>

        {/* Existing photos */}
        {existingPhotos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {existingPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={photo.url}
                  alt="Unit"
                  className="aspect-square w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeExistingPhoto(photo.id)
                  }
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New photos */}
        {newPhotos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {newPhotos.map((photo, index) => (
              <div
                key={photo.preview}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={photo.preview}
                  alt={`New photo ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeNewPhoto(index)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
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