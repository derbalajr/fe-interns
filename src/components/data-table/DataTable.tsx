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
  pageSize = 8,
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

  const shouldShowPagination = displayedTotalPages > 1;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="h-11 border-b border-[#e8e8e8] bg-[#f7f7f7] hover:bg-[#f7f7f7]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-5 text-[12px] font-semibold text-[#292929]"
                  >
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
                <TableRow
                  key={row.id}
                  className="h-[58px] border-b border-[#ededed] transition-colors last:border-b-0 hover:bg-[#fcfcfc]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-5 py-2.5 text-[13px] text-[#4c4c4c]"
                    >
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
                  className="h-56 text-center text-sm text-[#777777]"
                >
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {shouldShowPagination && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs text-[#777777]">
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
              className="h-8 rounded-lg border-[#e2e2e2] bg-white px-3 text-xs text-[#555555] shadow-none"
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
              className="h-8 rounded-lg border-[#e2e2e2] bg-white px-3 text-xs text-[#555555] shadow-none"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}