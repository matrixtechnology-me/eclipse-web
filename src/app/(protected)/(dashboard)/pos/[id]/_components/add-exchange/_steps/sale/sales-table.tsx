"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../..";
import {
  getCustomerPaidSalesAction,
  SaleItem,
} from "../../_actions/get-customer-sales";
import { ColumnDef } from "@tanstack/react-table";
import {
  EntityTable,
  EntityTableBody,
  EntityTableColumnHeader,
  EntityTableContainer,
  EntityTableHeader,
} from "@/components/entity-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEntityTable } from "@/components/entity-table/hook";
import { usePagination } from "@/hooks/use-pagination";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import moment from "moment";

type CustomerSalesTableProps = {
  tenantId: string;
};

const PAGE = 1;
const PAGE_SIZE = 99;

export const CustomerSalesTable: FC<CustomerSalesTableProps> = ({
  tenantId,
}) => {
  const [values, setValues] = useState<SaleItem[]>([]);

  const form = useFormContext<FormSchema>();

  const [watchedCustomerId, watchedSaleId] = useWatch({
    name: ["customerId", "sale.id"],
    control: form.control,
  });

  const handleSelect = (sale: SaleItem) => {
    const payload: FormSchema["sale"] = {
      ...sale,
      products: sale.products.map(saleItem => ({
        ...saleItem,
        itemId: saleItem.id,
      })),
    }

    form.setValue("sale", payload, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  const handleUnselect = () => {
    form.resetField("sale");
    form.resetField("products.returned");
  }

  const columns: ColumnDef<SaleItem>[] = useMemo(
    () => [
      {
        id: "select",
        header: () => <span>#</span>,
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              if (typeof value !== "boolean") return;
              // row.toggleSelected(value);

              value ? handleSelect(row.original) : handleUnselect();
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
      },
      {
        id: "id",
        header: () => <span>Transação</span>,
        accessorKey: "id",
        cell: ({ row }) => (
          <p className="flex-1 text-sm line-clamp-1">
            {String(row.index + 1).padStart(3, '0')}
          </p>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        id: "items",
        accessorFn: (sale) => sale.totalItems,
        header: ({ column }) => (
          <EntityTableColumnHeader title="Itens" column={column} />
        ),
        cell: ({ row }) => (
          <p className="flex-1 text-sm line-clamp-2">
            {row.original.totalItems}
          </p>
        ),
      },
      {
        id: "paidTotal",
        accessorFn: (sale) => sale.paidTotal,
        header: ({ column }) => (
          <EntityTableColumnHeader title="Pago" column={column} />
        ),
        cell: ({ row }) => (
          <p className="flex-1 text-sm line-clamp-2">
            {CurrencyFormatter.format(row.original.paidTotal)}
          </p>
        ),
      },
      {
        id: "salePrice",
        accessorFn: (sale) => sale.estimatedTotal,
        header: ({ column }) => (
          <EntityTableColumnHeader title="Total" column={column} />
        ),
        cell: ({ row }) => (
          <p className="flex-1 text-sm line-clamp-2">
            {CurrencyFormatter.format(row.original.estimatedTotal)}
          </p>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => (
          <EntityTableColumnHeader title="Data" column={column} />
        ),
        cell: ({ row }) => (
          <p className="flex-1 text-sm line-clamp-2">
            {moment(row.original.createdAt).format("DD/MM/YYYY")}
          </p>
        ),
      },
    ],
    [values],
  );

  const paginationProps = usePagination({
    initialItemsPerPage: PAGE_SIZE,
    initialPage: PAGE,
    initialTotal: 0,
  });

  const { table } = useEntityTable<SaleItem>({
    data: values,
    columns,
    manualPagination: paginationProps,
  });

  useEffect(() => {
    const loadValues = async () => {
      if (!watchedCustomerId) return;

      const result = await getCustomerPaidSalesAction({
        page: PAGE,
        pageSize: PAGE_SIZE,
        customerId: watchedCustomerId,
        tenantId,
      });

      if (result.isFailure) {
        return toast("", {
          description: "Erro ao buscar vendas.",
        });
      }

      const { sales } = result.value;
      setValues(sales);
    };

    loadValues();
  }, [watchedCustomerId]);

  useEffect(() => {
    if (!watchedCustomerId) return;
    if (values.length < 1 || columns.length < 1) return;

    if (!watchedSaleId) {
      return table.getSelectedRowModel().rows.forEach(
        row => row.toggleSelected(false)
      );
    }

    // Select active row based on the form value because the
    // table state is losed when the component unmounts.
    const activeRow = table.getRowModel().rows.find(row => row.original.id);
    if (!!activeRow) activeRow.toggleSelected(true);
  }, [columns, watchedSaleId]);

  return (
    <FormField
      control={form.control}
      name="sale"
      render={() => (
        <FormItem>
          <FormLabel>Venda</FormLabel>
          <div className="w-full overflow-x-auto">
            <FormControl>
              <EntityTable>
                <EntityTableContainer>
                  <EntityTableHeader table={table} />

                  <EntityTableBody table={table} />
                </EntityTableContainer>

                {/* 
                  No pagination required with PAGE_SIZE=99
                  <EntityTablePagination table={table} /> 
                */}
              </EntityTable>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
