import {
  Table as TableCn,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";
import { DeleteSpecification } from "./delete-specification";

type TableProps = {
  data: {
    id: string;
    label: string;
    value: string;
  }[];
  productId: string;
  tenantId: string;
};

export const Table: FC<TableProps> = ({ data, productId, tenantId }) => {
  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Tipo</TableHead>
            <TableHead className="text-left">Valor</TableHead>
            <TableHead className="text-left">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.label}</TableCell>
              <TableCell>{item.value}</TableCell>
              <TableCell>
                <DeleteSpecification
                  specificationId={item.id}
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
