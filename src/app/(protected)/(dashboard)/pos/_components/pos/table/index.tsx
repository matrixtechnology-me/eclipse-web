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
import { EPosStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CurrencyFormatter } from "@/utils/formatters/currency";

type TableProps = {
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    status: EPosStatus;
    summary: {
      entries: { count: number; amount: number };
      outputs: { count: number; amount: number };
      sales: { count: number; amount: number };
      balance: number;
    };
  }[];
  pagination: {
    initialPage: number;
    initialPageSize: number;
  };
};

export const Table: FC<TableProps> = ({ data, pagination }) => {
  const router = useRouter();

  const handleRedirectToCustomer = (posId: string) => {
    router.push(PATHS.PROTECTED.DASHBOARD.POS.POS(posId).INDEX);
  };

  const getStatusBadge = (status: EPosStatus) => {
    const statusMap = {
      [EPosStatus.Opened]: "Aberto",
      [EPosStatus.Closed]: "Fechado",
      [EPosStatus.UnderReview]: "Em conferência",
    };

    const colorMap = {
      [EPosStatus.Opened]: "bg-green-100 text-green-800",
      [EPosStatus.Closed]: "bg-red-100 text-red-800",
      [EPosStatus.UnderReview]: "bg-yellow-100 text-yellow-800",
    };

    return <Badge className={colorMap[status]}>{statusMap[status]}</Badge>;
  };

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Descrição</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-left">Entradas</TableHead>
            <TableHead className="text-left">Saídas</TableHead>
            <TableHead className="text-left">Vendas</TableHead>
            <TableHead className="text-left">Saldo</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              className="h-12"
              onClick={() => handleRedirectToCustomer(item.id)}
            >
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell className="line-clamp-1">{item.description}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {CurrencyFormatter.format(item.summary.entries.amount)}
                  <span className="text-xs text-muted-foreground">
                    {item.summary.entries.count}{" "}
                    {item.summary.entries.count > 1 ? "operações" : "operação"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {CurrencyFormatter.format(item.summary.outputs.amount)}
                  <span className="text-xs text-muted-foreground">
                    {item.summary.outputs.count}{" "}
                    {item.summary.outputs.count > 1 ? "operações" : "operação"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {CurrencyFormatter.format(item.summary.sales.amount)}
                  <span className="text-xs text-muted-foreground">
                    {item.summary.sales.count}{" "}
                    {item.summary.sales.count > 1 ? "operações" : "operação"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {CurrencyFormatter.format(item.summary.balance)}
                  <span className="text-xs text-muted-foreground">
                    {item.summary.entries.count +
                      item.summary.outputs.count +
                      item.summary.sales.count}{" "}
                    {item.summary.entries.count +
                      item.summary.outputs.count +
                      item.summary.sales.count >
                    1
                      ? "operações"
                      : "operação"}
                  </span>
                </div>
              </TableCell>
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
            <TableCell colSpan={10}>
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
