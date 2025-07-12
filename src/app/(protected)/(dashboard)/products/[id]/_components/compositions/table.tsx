import {
  Table as TableCn,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";
import { DeleteComposition } from "./delete-composition";
import { Composition } from "../../_actions/get-product-compositions";

type TableProps = {
  data: Composition[];
  productId: string;
  tenantId: string;
};

export const Table: FC<TableProps> = ({ data, productId, tenantId }) => {
  return (
    <div className="w-full border rounded-sm overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Valor</TableHead>
            <TableHead className="text-left">Quantidade</TableHead>
            <TableHead className="text-left">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.product.internalCode}</TableCell>
              <TableCell>{item.totalQty}</TableCell>
              <TableCell>
                <DeleteComposition
                  compositionId={item.id}
                  productId={productId}
                  tenantId={tenantId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableCn>
    </div>
  );
};
