import { CustomerFormDemo } from "@/components/form/CustomerFormDemo";

export function CustomersPage() {
  return (
    <div className="space-y-8">
      {/* Existing page content */}

      {import.meta.env.DEV && <CustomerFormDemo />}
    </div>
  );
}
