import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { EPosEventType } from "@prisma/client";
import moment from "moment";
import { FC } from "react";

type HistoryTableProps = {
  data: {
    id: string;
    type: EPosEventType;
    amount: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const getPosEventTypeLabel = (type: EPosEventType): string => {
  switch (type) {
    case "Sale":
      return "Venda";
    case "Entry":
      return "Entrada";
    case "Output":
      return "Saída";
    case "Payment":
      return "Pagamento";
    case "Return":
      return "Devolução";
    case "Exchange":
      return "Troca";
    default:
      return "Tipo desconhecido";
  }
};

export const HistoryTable: FC<HistoryTableProps> = ({ data }) => {
  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Tipo de evento</TableHead>
            <TableHead className="text-left">Descrição</TableHead>
            <TableHead className="text-left">Valor</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{getPosEventTypeLabel(item.type)}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{CurrencyFormatter.format(item.amount)}</TableCell>
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
