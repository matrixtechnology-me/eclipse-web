import {
  Table as TableCn,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import moment from "moment";
import { FC } from "react";

type TableProps = {
  data: {
    id: string;
    name: string;
    totalQty: number;
    salePrice: number;
    costPrice: number;
    lotNumber: string;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export const Table: FC<TableProps> = ({ data }) => {
  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Número</TableHead>
            <TableHead className="text-left">Preço de custo</TableHead>
            <TableHead className="text-left">Quantidade total</TableHead>
            <TableHead className="text-left">Data de validade</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.lotNumber.toUpperCase()}</TableCell>
              <TableCell>{CurrencyFormatter.format(item.costPrice)}</TableCell>
              <TableCell>{item.totalQty}</TableCell>
              <TableCell>
                {item.expiresAt
                  ? moment(item.expiresAt).format("DD/MM/YYYY")
                  : "-"}
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
      </TableCn>
    </div>
  );
};
