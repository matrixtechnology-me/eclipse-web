import {
  Table as TableCn,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import moment from "moment";
import { FC, useMemo } from "react";

type Product = {
  id: string;
  name: string;
  totalQty: number;
  salePrice: number;
  costPrice: number;
  stockLot: {
    id: string;
    lotNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

type TableItemsProps = {
  data: Product[];
};

export const TableItems: FC<TableItemsProps> = ({ data }) => {
  const total = useMemo(() => {
    const subtotal = data.reduce(
      (sum, item) => sum + item.salePrice * item.totalQty,
      0
    );
    return subtotal;
  }, [data]);

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <TableCn className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nome</TableHead>
            <TableHead className="text-left">Preço de custo</TableHead>
            <TableHead className="text-left">Preço de venda</TableHead>
            <TableHead className="text-left">Lote</TableHead>
            <TableHead className="text-left">Quantidade total</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{CurrencyFormatter.format(item.costPrice)}</TableCell>
              <TableCell>{CurrencyFormatter.format(item.salePrice)}</TableCell>
              <TableCell>
                <span>{item.stockLot.lotNumber.toUpperCase()}</span>
              </TableCell>
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
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">
              {CurrencyFormatter.format(total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </TableCn>
    </div>
  );
};
