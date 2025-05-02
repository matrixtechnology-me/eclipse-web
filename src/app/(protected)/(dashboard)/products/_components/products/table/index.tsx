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
import { YesNo } from "@/components/yes-no";
import { PATHS } from "@/config/paths";
import { PhoneNumberFormatter } from "@/utils/formatters/phone-number";
import moment from "moment";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Pagination } from "../pagination";

type TableProps = {
  data: {
    id: string;
    name: string;
    barCode: string;
    active: boolean;
    salePrice: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  pagination: {
    initialPage: number;
    initialPageSize: number;
  };
};

export const Table: FC<TableProps> = ({ data, pagination }) => {
  const router = useRouter();

  const handleRedirectToCustomer = (customerId: string) => {
    router.push(PATHS.PROTECTED.DASHBOARD.PRODUCTS.PRODUCT(customerId).INDEX);
  };

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-left">Índice</TableHead>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Código de barras</TableHead>
            <TableHead className="text-left">Está ativo?</TableHead>
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
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.barCode}</TableCell>
              <TableCell>
                <YesNo value={item.active} />
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
            <TableCell colSpan={6}>
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
