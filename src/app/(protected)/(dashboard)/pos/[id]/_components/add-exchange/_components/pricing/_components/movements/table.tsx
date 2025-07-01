import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { CoinsIcon, DollarSign, HistoryIcon } from "lucide-react";
import { PaymentMethodPresenter } from "@/utils/presenters/payment-method";
import { MovementTableItem } from ".";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../../../..";
import DineroFactory from "dinero.js";
import { ReactNode } from "react";
import clsx from "clsx";

type RenderElements = {
  label: string;
  icon: ReactNode;
  amountLabel: string;
}

const getRenderElements = (item: MovementTableItem): RenderElements => {
  const iconProps = { size: 15, strokeWidth: 2.5 };
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
}

export const ExchangeMovimentsTable = ({
  data,
  currentPayment,
}: Props) => {
  const form = useFormContext<FormSchema>();

  const sale = useWatch({
    name: "sale",
    control: form.control,
  });

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const { label, icon, amountLabel } = getRenderElements(item);

              return (
                <TableRow key={index} className={clsx({
                  "bg-muted/60": item.type == "so-far",
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
                </TableRow>
              );
            })}
            <TableRow className="font-medium">
              <TableCell colSpan={2} className="left-0 sticky bg-background z-10">
                Total pago
              </TableCell>
              <TableCell>
                {CurrencyFormatter.format(currentPayment.toUnit())}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}