"use client";

import {
  Table as TableCn,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PATHS } from "@/config/paths";
import moment from "moment";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Pagination } from "../pagination";

type TableProps = {
  data: {
    id: string;
    totalQty: number;
    product: {
      id: string;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
  pagination: {
    initialPage: number;
    initialPageSize: number;
  };
  tenantId: string;
};

export const Table: FC<TableProps> = ({ data, pagination, tenantId }) => {
  const router = useRouter();

  const handleRedirectToCustomer = (stockId: string) => {
    router.push(PATHS.PROTECTED.DASHBOARD.STOCKS.STOCK(stockId).INDEX);
  };

  return (
    <div className="w-full border rounded-sm overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-left">Nome do produto</TableHead>
            <TableHead className="text-left">Quantidade total</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              className="h-12"
              onClick={() => {
                handleRedirectToCustomer(item.id);
              }}
            >
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.totalQty}</TableCell>
              <TableCell>
                {moment(item.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {moment(item.updatedAt).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="h-12">
          <TableRow className="h-12">
            <TableCell colSpan={6}>
              <Pagination
                initialPage={pagination.initialPage}
                initialPageSize={pagination.initialPageSize}
                tenantId={tenantId}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </TableCn>
    </div>
  );
};
