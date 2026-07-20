import type { ReactNode } from "react";

interface FormFieldWrapperProps {
  id: string;
  label: string;
  error?: string;
  description?: string;
  children: (describedBy?: string) => ReactNode;
}

export function FormFieldWrapper({
  id,
  label,
  error,
  description,
  children,
}: FormFieldWrapperProps) {
  const descriptionId = description
    ? `${id}-description`
    : undefined;

  const errorId = error ? `${id}-error` : undefined;

  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      {children(describedBy)}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}