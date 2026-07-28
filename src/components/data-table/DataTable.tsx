import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  manualPagination?: boolean;
  currentPage?: number;
  pageCount?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 5,
  manualPagination = false,
  currentPage,
  pageCount,
  onPreviousPage,
  onNextPage,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    manualPagination,
    pageCount,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
  });

  const displayedCurrentPage =
    currentPage ?? table.getState().pagination.pageIndex + 1;

  const displayedTotalPages = pageCount ?? Math.max(table.getPageCount(), 1);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Page {displayedCurrentPage} of {displayedTotalPages}
        </p>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              manualPagination ? onPreviousPage?.() : table.previousPage()
            }
            disabled={
              manualPagination
                ? displayedCurrentPage <= 1
                : !table.getCanPreviousPage()
            }
          >
            Previous
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              manualPagination ? onNextPage?.() : table.nextPage()
            }
            disabled={
              manualPagination
                ? displayedCurrentPage >= displayedTotalPages
                : !table.getCanNextPage()
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
