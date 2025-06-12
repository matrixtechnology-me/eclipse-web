"use client";

import {
  TableBody,
  TableCell,
  Table as TableCn,
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
    name: string;
    description: string;
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

  const handleRedirectToCategory = (categoryId: string) => {
    router.push(
      PATHS.PROTECTED.DASHBOARD.PRODUCTS.CATEGORIES.CATEGORY(categoryId).INDEX
    );
  };

  return (
    <div className="w-full border rounded-sm overflow-x-auto hidden lg:block">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Descrição</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category, index) => (
            <TableRow
              key={category.id}
              className="h-12 hover:cursor-pointer hover:bg-secondary/25"
              onClick={() => handleRedirectToCategory(category.id)}
            >
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                {category.description || (
                  <span className="text-muted-foreground">Sem descrição</span>
                )}
              </TableCell>
              <TableCell>
                {moment(category.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {moment(category.updatedAt).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="h-12">
          <TableRow>
            <TableCell colSpan={5}>
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
