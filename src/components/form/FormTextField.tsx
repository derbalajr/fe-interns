import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";

import { FormFieldWrapper } from "./FormFieldWrapper";

interface FormTextFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  disabled?: boolean;
  min?: number;
  step?: number | string;
}

export function FormTextField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled = false,
  min,
  step,
}: FormTextFieldProps<TFieldValues>) {
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
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              step={step}
              aria-invalid={fieldState.invalid || undefined}
              aria-describedby={describedBy}
            />
          )}
        </FormFieldWrapper>
      )}
    />
  );
}
