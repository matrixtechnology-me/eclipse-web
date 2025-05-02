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
import { Badge } from "@/components/ui/badge";

type TableProps = {
  data: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    costPrice: number;
    salePrice: number;
    totalItems: number;
    status: "completed" | "pending" | "canceled";
    customer: {
      id: string;
      name: string;
    };
  }[];
  pagination: {
    initialPage: number;
    initialPageSize: number;
  };
};

export const Table: FC<TableProps> = ({ data, pagination }) => {
  const router = useRouter();

  const handleRedirectToSale = (saleId: string) => {
    router.push(PATHS.PROTECTED.DASHBOARD.SALES.SALE(saleId).INDEX);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: "Concluída",
      pending: "Pendente",
      canceled: "Cancelada",
    };

    const colorMap = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      canceled: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colorMap[status as keyof typeof colorMap]}>
        {statusMap[status as keyof typeof statusMap]}
      </Badge>
    );
  };

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-left">Cliente</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-left">Itens</TableHead>
            <TableHead className="text-left">Custo</TableHead>
            <TableHead className="text-left">Venda</TableHead>
            <TableHead className="text-left">Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              className="h-12 cursor-pointer"
              onClick={() => handleRedirectToSale(item.id)}
            >
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell>{item.customer.name}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>{item.totalItems}</TableCell>
              <TableCell>{formatCurrency(item.costPrice)}</TableCell>
              <TableCell>{formatCurrency(item.salePrice)}</TableCell>
              <TableCell>
                {moment(item.createdAt).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="h-12">
          <TableRow className="h-12">
            <TableCell colSpan={7}>
              <Pagination
                initialPage={pagination.initialPage}
                initialPageSize={pagination.initialPageSize}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </TableCn>
    </div>
  );
};
