import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";

import { FormFieldWrapper } from "./FormFieldWrapper";

interface FormDateFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}

export function FormDateField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  min,
  max,
  disabled = false,
}: FormDateFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  const id = `field-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormFieldWrapper
          id={id}
          label={label}
          description={description}
          error={fieldState.error?.message}
        >
          {(describedBy) => (
            <Input
              {...field}
              id={id}
              type="date"
              min={min}
              max={max}
              disabled={disabled}
              aria-invalid={fieldState.invalid || undefined}
              aria-describedby={describedBy}
            />
          )}
        </FormFieldWrapper>
      )}
    />
  );
}
