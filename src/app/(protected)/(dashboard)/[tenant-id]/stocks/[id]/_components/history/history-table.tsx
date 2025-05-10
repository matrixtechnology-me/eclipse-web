import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EStockEventType } from "@prisma/client";
import moment from "moment";
import { FC } from "react";

type HistoryTableProps = {
  data: {
    id: string;
    type: EStockEventType;
    quantity: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const getStockEventTypeLabel = (type: EStockEventType): string => {
  switch (type) {
    case "Entry":
      return "Entrada";
    case "Output":
      return "Saída";
    default:
      return "Tipo desconhecido";
  }
};

export const HistoryTable: FC<HistoryTableProps> = ({ data }) => {
  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-left">Tipo de evento</TableHead>
            <TableHead className="text-left">Descrição</TableHead>
            <TableHead className="text-left">Quantidade</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="h-12">
              <TableCell>{getStockEventTypeLabel(item.type)}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {moment(item.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {moment(item.updatedAt).format("DD/MM/YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
