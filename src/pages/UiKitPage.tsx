import { useState } from "react";
import { customerColumns } from "@/components/data-table/customerColumns";
import { DataTable } from "@/components/data-table/DataTable";
import { mockCustomers } from "@/mocks/customers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UiKitPage() {
  const [customerType, setCustomerType] =
    useState("");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Reusable UI Kit
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Shared components used across the CRM.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>

          <CardDescription>
            Common button variants.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Button>Primary button</Button>

          <Button variant="secondary">
            Secondary button
          </Button>

          <Button variant="outline">
            Outline button
          </Button>

          <Button variant="destructive">
            Delete
          </Button>

          <Button disabled>
            Disabled
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inputs and selects</CardTitle>

          <CardDescription>
            Reusable form controls.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="customer-name"
              className="text-sm font-medium"
            >
              Customer name
            </label>

            <Input
              id="customer-name"
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Customer type
            </label>

            <Select
  value={customerType}
  onValueChange={(value) => {
    setCustomerType(value ?? "");
  }}
>
              <SelectTrigger>
                <SelectValue placeholder="Select customer type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="individual">
                  Individual
                </SelectItem>

                <SelectItem value="company">
                  Company
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>

          <CardDescription>
            Status indicators used in tables and cards.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-3">
          <Badge>Active</Badge>

          <Badge variant="secondary">
            Pending
          </Badge>

          <Badge variant="outline">
            Draft
          </Badge>

          <Badge variant="destructive">
            Inactive
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dialog</CardTitle>

          <CardDescription>
            A reusable modal window.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Dialog>
           <DialogTrigger
  render={
    <Button variant="outline">
      Open dialog
    </Button>
  }
/>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Create customer
                </DialogTitle>

                <DialogDescription>
                  This is a demonstration of the
                  shared dialog component.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-4">
                <label
                  htmlFor="dialog-customer-name"
                  className="text-sm font-medium"
                >
                  Customer name
                </label>

                <Input
                  id="dialog-customer-name"
                  placeholder="Enter customer name"
                />
              </div>

              <DialogFooter>
                <Button type="button">
                  Save customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Card>
  <CardHeader>
    <CardTitle>Customer data table</CardTitle>

    <CardDescription>
      A reusable paginated table powered by
      TanStack Table.
    </CardDescription>
  </CardHeader>

  <CardContent>
    <DataTable
      columns={customerColumns}
      data={mockCustomers}
      pageSize={5}
    />
  </CardContent>
</Card>
    </div>
  );
}