import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { EPosEventStatus, EPosEventType } from "@prisma/client";
import moment from "moment";
import { FC } from "react";
import { CancelPosEvent } from "./cancel-pos-event";

type HistoryTableProps = {
  data: {
    id: string;
    type: EPosEventType;
    status: EPosEventStatus;
    amount: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  posId: string;
  tenantId: string;
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

const getStatusBadge = (status: string) => {
  const statusMap = {
    [EPosEventStatus.Processed]: "Processada",
    [EPosEventStatus.Canceled]: "Cancelada",
  };

  const colorMap = {
    [EPosEventStatus.Processed]: "bg-green-100 text-green-800",
    [EPosEventStatus.Canceled]: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={colorMap[status as keyof typeof colorMap]}>
      {statusMap[status as keyof typeof statusMap]}
    </Badge>
  );
};

export const HistoryTable: FC<HistoryTableProps> = ({
  data,
  posId,
  tenantId,
}) => {
  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-left">Tipo</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-left">Valor</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
            <TableHead className="text-left">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} className="h-12">
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell>{getPosEventTypeLabel(item.type)}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>{CurrencyFormatter.format(item.amount)}</TableCell>
              <TableCell>
                {moment(item.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {moment(item.updatedAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                <CancelPosEvent
                  value={item.status}
                  posEventId={item.id}
                  posId={posId}
                  tenantId={tenantId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
