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
import { ESaleMovementPaymentMethod } from "@prisma/client";

interface ReceivingMethodsTableProps {
  receivingMethodsFieldArray: UseFieldArrayReturn<
    CreateSaleSchema,
    "receivingMethods"
  >;
}

const getPaymentMethodLabel = (method: ESaleMovementPaymentMethod) => {
  switch (method) {
    case ESaleMovementPaymentMethod.Cash:
      return "Dinheiro";
    case ESaleMovementPaymentMethod.CreditCard:
      return "Cartão de crédito";
    case ESaleMovementPaymentMethod.DebitCard:
      return "Cartão de débito";
    case ESaleMovementPaymentMethod.Pix:
      return "Pix";
    default:
      return "-";
  }
};

export const ReceivingMethodsTable = ({
  receivingMethodsFieldArray,
}: ReceivingMethodsTableProps) => {
  return receivingMethodsFieldArray.fields.length ? (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Método</TableHead>
            <TableHead className="text-left">Valor</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receivingMethodsFieldArray.fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium">
                {getPaymentMethodLabel(field.method)}
              </TableCell>
              <TableCell>{CurrencyFormatter.format(field.amount)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  className="p-0 size-9"
                  onClick={() =>
                    receivingMethodsFieldArray.remove(
                      receivingMethodsFieldArray.fields.indexOf(field)
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
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {CurrencyFormatter.format(
                receivingMethodsFieldArray.fields.reduce(
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
        Nenhum forma de recebimento adicionado ainda. Clique em "Adicionar forma
        de recebimento" para adicionar um.
      </p>
    </div>
  );
};
