import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { CoinsIcon, DollarSign, HistoryIcon, TrashIcon } from "lucide-react";
import { PaymentMethodPresenter } from "@/utils/presenters/payment-method";
import { MovementTableItem } from ".";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../../../..";
import DineroFactory from "dinero.js";
import { ReactNode, useCallback } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type RenderElements = {
  label: string;
  icon: ReactNode;
  amountLabel: string;
}

const iconProps = { size: 15, strokeWidth: 2.5 };

const getRenderElements = (item: MovementTableItem): RenderElements => {
  const amountStr = CurrencyFormatter.format(item.amount);

  switch (item.type) {
    case "change": return {
      label: "Troco",
      icon: <CoinsIcon className="text-yellow-500" {...iconProps} />,
      amountLabel: "- " + amountStr,
    };
    case "payment": return {
      label: "Pagamento",
      icon: <DollarSign className="text-blue-400" {...iconProps} />,
      amountLabel: "+ " + amountStr,
    };
    case "so-far": return {
      label: "Já pago",
      icon: <HistoryIcon className="text-[#22c55e]"  {...iconProps} />,
      amountLabel: "+ " + amountStr,
    };
  }
}

type Props = {
  data: MovementTableItem[];
  currentPayment: DineroFactory.Dinero;
  removeField: (fieldIndex: number) => void;
}

export const ExchangeMovementsTable = ({
  data,
  currentPayment,
  removeField,
}: Props) => {
  const form = useFormContext<FormSchema>();

  const sale = useWatch({
    name: "sale",
    control: form.control,
  });

  const getTotalLabel = useCallback(() => {
    const prefix = currentPayment.isNegative() ? "- " : "+ ";
    return prefix + CurrencyFormatter.format(currentPayment.toUnit());
  }, [currentPayment]);

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      {!sale ? (
        <div className="w-full px-5 py-8 flex items-center justify-center border border-dashed rounded-lg">
          <p className="text-center text-muted-foreground text-sm">
            Selecione uma venda para visualizar suas movimentações.
          </p>
        </div>
      ) : data.length < 1 ? (
        <div className="w-full px-5 py-8 flex items-center justify-center border border-dashed rounded-lg">
          <p className="text-center text-muted-foreground text-sm">
            Adicione um pagamento para iniciar as movimentações da venda.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left sticky left-0 bg-background">
                Tipo
              </TableHead>
              <TableHead className="text-left">Método</TableHead>
              <TableHead className="text-left">Valor</TableHead>
              <TableHead className="text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const { label, icon, amountLabel } = getRenderElements(item);

              return (
                <TableRow key={index} className={clsx({
                  "bg-muted/50": item.type == "so-far",
                })}>
                  <TableCell>
                    <div className="w-min flex items-center gap-2 rounded-lg py-1 px-2 border b-slate-700 text-[13px]">
                      {icon}
                      {label}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {
                      item.paymentMethod
                        ? PaymentMethodPresenter.present(item.paymentMethod)
                        : "-"
                    }
                  </TableCell>
                  <TableCell className="font-medium">
                    {amountLabel}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="w-full flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="p-0 size-9 cursor-pointer"
                        disabled={item.fieldIndex == undefined}
                        onClick={() => removeField(item.fieldIndex!)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="font-medium">
              <TableCell colSpan={2}>
                Total pago
              </TableCell>
              <TableCell colSpan={2}>
                {getTotalLabel()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}