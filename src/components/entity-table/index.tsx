"use client";

import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CheckIcon,
  PlusCircleIcon,
  XIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
  Settings2Icon,
} from "lucide-react";
import {
  Table as TanstackTable,
  flexRender,
  Column,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/shadcn";
import { Spin } from "../spin";
import { debounce } from "lodash";

export function EntityTable({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-y-4">{children}</div>;
}

export const EntityTableContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="rounded-md border flex-1">
      <Table className="min-w-max">{children}</Table>
    </div>
  );
};
export interface EntityTableHeaderProps<TData> {
  table: TanstackTable<TData>;
}

export const EntityTableHeader = <TData,>({
  table,
}: EntityTableHeaderProps<TData>) => {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

export interface EntityTableBodyProps<TData> {
  table: TanstackTable<TData>;
  isLoading?: boolean;
}

export const EntityTableBody = <TData,>({
  table,
  isLoading,
}: EntityTableBodyProps<TData>) => {
  return (
    <TableBody>
      {isLoading && (
        <TableRow className="min-w-max hover:bg-transparent">
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            <div className="w-full flex items-center justify-center">
              <Spin className="text-white" />
            </div>
          </TableCell>
        </TableRow>
      )}

      {!isLoading &&
        table.getRowModel().rows.length > 0 &&
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}

      {!isLoading && !table.getRowModel().rows.length && (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            Sem resultados
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export type TableStaticFilter = {
  title: string;
  columnId: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

export function EntityTableToolbar({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export interface EntityTableFilterProps<TData> {
  table: TanstackTable<TData>;
  staticFilters: TableStaticFilter[];
  searchableFields?: { columnId: string; label: string }[];
  children: ReactNode;
}

export function EntityTableFilters<TData>({
  table,
  staticFilters,
  searchableFields,
  children,
}: EntityTableFilterProps<TData>) {
  const [searchColumnId, setSearchColumnId] = useState<string | undefined>(
    searchableFields ? searchableFields[0]?.columnId : undefined,
  );

  const isFiltered = table.getState().columnFilters.length > 0;

  const handleInputSearch = useCallback(
    debounce((input: string) => {
      const column = table.getColumn(searchColumnId!)!;

      if (input.length == 0 || input === " ") column.setFilterValue([]);
      else column.setFilterValue([input]);
    }, 1000),
    [],
  );

  return (
    <div className="flex flex-1 items-center gap-x-2 flex-wrap gap-y-2">
      {!!searchableFields?.length && (
        <div className="flex rounded-md overflow-hidden border-[1px] border-input">
          <Input
            className="h-9 max-w-[150px] border-none focus-visible:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Buscar registros..."
            onChange={({ target }) => handleInputSearch(target.value)}
          />

          <Separator className="h-9" orientation="vertical" />

          <Select value={searchColumnId} onValueChange={setSearchColumnId}>
            <SelectTrigger className="h-9 w-[140px] border-none ring-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Selecione um campo" />
            </SelectTrigger>

            <SelectContent>
              {searchableFields.map(({ columnId, label }) => (
                <SelectItem
                  className="text-[13px]"
                  key={columnId}
                  value={columnId}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {staticFilters.map(({ title, columnId, options }) => {
        const column = table.getColumn(columnId);
        if (!column) return <></>;

        return (
          <EntityTableStaticFilter
            key={column.id}
            column={column}
            title={title}
            options={options}
          />
        );
      })}

      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Resetar
          <XIcon className="ml-2 h-4 w-4" />
        </Button>
      )}

      {children}
    </div>
  );
}

export interface EntityTableStaticFilterProps<TData, TValue> {
  title: string;
  column: Column<TData, TValue>;
  options: TableStaticFilter["options"];
}

export function EntityTableStaticFilter<TData, TValue>({
  column,
  title,
  options,
}: EntityTableStaticFilterProps<TData, TValue>) {
  // from the applied filters on column, get only those related to the options
  // so then incomplete filters coming from text inputs like "Peter Par"
  // are not considered, but only pre-defined options like "active" or "inactive"
  const selectedValues = useMemo(() => {
    const existingFilters = column.getFilterValue() as string[];
    if (!existingFilters) return new Set();

    const optionFilters = existingFilters.filter((filter) =>
      options.some((option) => option.value === filter),
    );

    return new Set(optionFilters);
  }, [column.getFilterValue()]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      isSelected
                        ? selectedValues.delete(option.value)
                        : selectedValues.add(option.value);

                      const filterValues = Array.from(selectedValues);
                      column.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Limpar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface EntityTableViewOptionsProps<TData> {
  table: TanstackTable<TData>;
}

export function EntityTableViewOptions<TData>({
  table,
}: EntityTableViewOptionsProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="flex h-8 xl:ml-auto"
        >
          <Settings2Icon className="mr-2 h-4 w-4" />
          Visualizar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[150px]"
        align="end"
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface EntityTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function EntityTableColumnHeader<TData, TValue>({
  column,
  title,
}: EntityTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div>{title}</div>;
  }

  return (
    <div className={cn("flex items-center gap-x-2")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false, true)}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true, true)}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <XIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Cancelar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Ocultar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export interface EntityTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  isLoading?: boolean;
}

export function EntityTablePagination<TData>({
  table,
  isLoading,
}: EntityTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 flex-wrap gap-y-2">
      <div className="flex-1 flex-shrink-0 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} linhas selecionadas.
      </div>

      <div className="flex items-center flex-wrap gap-x-6 gap-y-3 lg:gap-x-8">
        <div className="flex flex-shrink-0 items-center gap-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-fit gap-3">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize.toString().length > 1 ? pageSize : `0${pageSize}`}{" "}
                  linhas por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-shrink-0 items-center justify-center text-sm font-medium">
          {isLoading ? (
            <Spin className="text-white" />
          ) : (
            <>
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
