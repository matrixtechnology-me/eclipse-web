import { useState } from "react";
import {
  Table as TanstackTable,
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { UsePaginationReturnValue } from "@/hooks/use-pagination";

export type UseEntityTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[],
  manualPagination: UsePaginationReturnValue;
}

export type UseEntityTableReturnValye<TData> = {
  table: TanstackTable<TData>;
}

export const useEntityTable = <TData,>({
  data,
  columns,
  manualPagination,
}: UseEntityTableProps<TData>): UseEntityTableReturnValye<TData> => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    page,
    itemsPerPage,
    total,
    handlePreviousPage,
    handleNextPage,
    handleFirstPage,
    handleLastPage,
    handleChangeItemsPerPage,
  } = manualPagination;

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { // pageIndex is zero-based
        pageIndex: data.length ? page - 1 : 0,
        pageSize: itemsPerPage,
      },
    },
    rowCount: total,
    pageCount: Math.ceil(total / itemsPerPage),
    manualPagination: true,
    enableRowSelection: true,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // ...tableOptions,
  });

  function handlePaginationChange(updaterOrValue: Updater<PaginationState>) {
    let paginationState: PaginationState;

    if (typeof updaterOrValue == "object") paginationState = updaterOrValue;
    else if (typeof updaterOrValue === "function") {
      paginationState = updaterOrValue({
        pageIndex: data ? page - 1 : 0,
        pageSize: itemsPerPage,
      });
    }

    const { pageIndex, pageSize } = paginationState!;

    // pageIndex is zero-based
    const isPrevius = pageIndex + 1 == page - 1;
    const isNext = pageIndex + 1 == page + 1;
    const isFirst = pageIndex + 1 == 1;
    const isLast = pageIndex + 1 == Math.ceil(total / itemsPerPage);

    if (pageIndex + 1 != page) {
      if (isPrevius) handlePreviousPage();
      else if (isNext) handleNextPage();
      else if (isFirst) handleFirstPage();
      else if (isLast) handleLastPage();
    }

    if (pageSize != itemsPerPage) handleChangeItemsPerPage(pageSize);
  }

  return { table };
}
