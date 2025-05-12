"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PATHS } from "@/config/paths";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { useRouter } from "next/navigation";
import { FC } from "react";

type VariationsTableProps = {
  data: {
    id: string;
    imageUrl: string;
    skuCode: string;
    salePrice: number;
    specificationsCount: number;
  }[];
  productId: string;
  tenantId: string;
};

export const VariationsTable: FC<VariationsTableProps> = ({
  data,
  productId,
  tenantId,
}) => {
  const router = useRouter();

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">SKU</TableHead>
            <TableHead className="text-left">Preço de venda</TableHead>
            <TableHead className="text-left">Qtd. Especificações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer"
              onClick={() =>
                router.push(
                  PATHS.PROTECTED.DASHBOARD.PRODUCTS.PRODUCT(
                    productId
                  ).VARIATION(item.skuCode)
                )
              }
            >
              <TableCell>{item.skuCode.toUpperCase()}</TableCell>
              <TableCell>{CurrencyFormatter.format(item.salePrice)}</TableCell>
              <TableCell>{item.specificationsCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
