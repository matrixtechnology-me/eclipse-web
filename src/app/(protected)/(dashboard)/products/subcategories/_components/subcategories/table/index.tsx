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
import Link from "next/link";

type TableProps = {
  data: {
    id: string;
    name: string;
    description: string;
    category: {
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

  const handleRedirect = (categoryId: string) => {
    router.push(
      PATHS.PROTECTED.DASHBOARD.PRODUCTS.SUBCATEGORIES
        .SUBCATEGORY(categoryId).INDEX
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
            <TableHead className="text-left">Categoria</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              className="h-12 hover:cursor-pointer hover:bg-secondary/25"
              onClick={() => handleRedirect(item.id)}
            >
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="max-w-2xl truncate">
                {item.description || (
                  <span className="text-muted-foreground">Sem descrição</span>
                )}
              </TableCell>
              <TableCell>
                <Link
                  className="flex items-center gap-2"
                  href={
                    PATHS.PROTECTED.DASHBOARD.PRODUCTS.CATEGORIES.CATEGORY(
                      item.category.id
                    ).INDEX
                  }
                >
                  <span className="font-medium text-primary">
                    {item.category.name}
                  </span>
                </Link>
              </TableCell>

              <TableCell>
                {moment(item.createdAt).format("DD/MM/YYYY [às] HH:mm")}
              </TableCell>
              <TableCell>
                {moment(item.updatedAt).format("DD/MM/YYYY [às] HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="h-12">
          <TableRow>
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
