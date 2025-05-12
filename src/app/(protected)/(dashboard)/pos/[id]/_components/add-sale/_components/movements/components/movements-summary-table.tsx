import { Button } from "@/components/ui/button";
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
import { TrashIcon } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";
import { CreateSaleSchema } from "../../../_utils/validations/create-sale";
import { EPaymentMethod, ESaleMovementType } from "@prisma/client";

interface MovementsTableProps {
  movementsFieldArray: UseFieldArrayReturn<CreateSaleSchema, "movements">;
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

export const MovementsTable = ({
  movementsFieldArray,
}: MovementsTableProps) => {
  return movementsFieldArray.fields.length ? (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Tipo</TableHead>
            <TableHead className="text-left">Forma de pagamento</TableHead>
            <TableHead className="text-left">Valor</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movementsFieldArray.fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium">
                {getMovementTypeLabel(field.type)}
              </TableCell>
              <TableCell className="font-medium">
                {getPaymentMethodLabel(field.method)}
              </TableCell>
              <TableCell>{CurrencyFormatter.format(field.amount)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  className="p-0 size-9"
                  onClick={() =>
                    movementsFieldArray.remove(
                      movementsFieldArray.fields.indexOf(field)
                    )
                  }
                >
                  <TrashIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {CurrencyFormatter.format(
                movementsFieldArray.fields.reduce(
                  (acc, field) => acc + field.amount,
                  0
                )
              )}
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
