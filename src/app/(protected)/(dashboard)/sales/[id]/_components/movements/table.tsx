import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { EPaymentMethod, ESaleMovementType } from "@prisma/client";
import moment from "moment";

interface MovementsTableProps {
  data: {
    id: string;
    type: ESaleMovementType;
    method: EPaymentMethod;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const getMovementTypeLabel = (type: ESaleMovementType) => {
  switch (type) {
    case ESaleMovementType.Change:
      return "Troco";
    case ESaleMovementType.Payment:
      return "Pagamento";
    default:
      return "-";
  }
};

const getPaymentMethodLabel = (method: EPaymentMethod) => {
  switch (method) {
    case EPaymentMethod.Cash:
      return "Dinheiro";
    case EPaymentMethod.CreditCard:
      return "Cartão de crédito";
    case EPaymentMethod.DebitCard:
      return "Cartão de débito";
    case EPaymentMethod.Pix:
      return "Pix";
    default:
      return "-";
  }
};

const getSubtotal = (
  movements: {
    type: ESaleMovementType;
    method: EPaymentMethod;
    amount: number;
  }[]
) => {
  const paymentsAmount = movements
    .filter((mv) => mv.type === ESaleMovementType.Payment)
    .reduce((acc, item) => acc + item.amount, 0);

  const changesAmount = movements
    .filter((mv) => mv.type === ESaleMovementType.Change)
    .reduce((acc, item) => acc + item.amount, 0);

  return paymentsAmount - changesAmount;
};

export const MovementsTable = ({ data }: MovementsTableProps) => {
  return data ? (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-left">Tipo</TableHead>
            <TableHead className="text-left">Forma de pagamento</TableHead>
            <TableHead className="text-left">Valor</TableHead>
            <TableHead className="text-left">Data de criação</TableHead>
            <TableHead className="text-left">Data de atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
              <TableCell className="font-medium">
                {getMovementTypeLabel(item.type)}
              </TableCell>
              <TableCell className="font-medium">
                {getPaymentMethodLabel(item.method)}
              </TableCell>
              <TableCell>{CurrencyFormatter.format(item.amount)}</TableCell>
              <TableCell>
                {moment(item.updatedAt).format("DD/MM/YYYY [às] HH:mm")}
              </TableCell>
              <TableCell>
                {moment(item.updatedAt).format("DD/MM/YYYY [às] HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">
              {CurrencyFormatter.format(getSubtotal(data))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ) : (
    <div className="w-full px-5 py-20 flex items-center justify-center border border-dashed rounded-lg">
      <p className="text-center">
        Nenhum movimentação adicionado ainda. Clique em "Adicionar forma de
        recebimento" para adicionar um.
      </p>
    </div>
  );
};
