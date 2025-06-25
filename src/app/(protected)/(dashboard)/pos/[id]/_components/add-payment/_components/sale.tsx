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
import { FormSchema } from "../";
import {
  getCustomerSalesAction,
  SaleItem,
} from "../_actions/get-customer-sales";
import { ESaleStatus } from "@prisma/client";
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

type CustomerSaleProps = {
  tenantId: string;
};

const PAGE = 1;
const PAGE_SIZE = 99;

export const CustomerSale: FC<CustomerSaleProps> = ({ tenantId }) => {
  const [values, setValues] = useState<SaleItem[]>([]);

  const form = useFormContext<FormSchema>();

  const watchedCustomerId = useWatch<FormSchema, "customerId">({
    name: "customerId",
    control: form.control,
  });

  const handleSelect = (sale: SaleItem) => {
    form.setValue("saleId", sale.id, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
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
              row.toggleSelected(value);
              handleSelect(row.original);
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
        accessorFn: (sale) => sale.salePrice,
        header: ({ column }) => (
          <EntityTableColumnHeader title="Total" column={column} />
        ),
        cell: ({ row }) => (
          <p className="flex-1 text-sm line-clamp-2">
            {CurrencyFormatter.format(row.original.salePrice)}
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

      const result = await getCustomerSalesAction({
        page: PAGE,
        pageSize: PAGE_SIZE,
        status: ESaleStatus.Processed,
        customerId: watchedCustomerId,
        tenantId,
      });

      if (result.isFailure) {
        return toast("", {
          description: "Erro ao buscar clientes.",
        });
      }

      const { sales } = result.value;
      setValues(sales);
    };

    loadValues();
  }, [watchedCustomerId]);

  return (
    <FormField
      control={form.control}
      name="saleId"
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
