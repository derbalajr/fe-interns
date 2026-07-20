import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  customerFormSchema,
  type CustomerFormValues,
} from "@/schemas/customerFormSchema";
import { toast } from "sonner";
import { FormDateField } from "./FormDateField";
import { FormSelectField } from "./FormSelectField";
import { FormTextField } from "./FormTextField";

const statusOptions = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

export function CustomerFormDemo() {
  const methods = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      status: undefined,
      followUpDate: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (values: CustomerFormValues) => {
    console.log("Validated values:", values);

    toast.success("Customer form submitted", {
      description: "The form passed validation successfully.",
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormTextField<CustomerFormValues>
          name="name"
          label="Customer name"
          placeholder="Enter customer name"
        />

        <FormTextField<CustomerFormValues>
          name="email"
          label="Email address"
          type="email"
          placeholder="customer@example.com"
        />

        <FormSelectField<CustomerFormValues>
          name="status"
          label="Status"
          placeholder="Select status"
          options={statusOptions}
        />

        <FormDateField<CustomerFormValues>
          name="followUpDate"
          label="Follow-up date"
        />

        <Button type="submit" disabled={isSubmitting}>
          Submit form
        </Button>
      </form>
    </FormProvider>
  );
}
