import { Label } from "@/components/ui/label";
import { FC, useCallback, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../../../..";
import { ExchangeMovimentsTable } from "./table";
import { EPaymentMethod } from "@prisma/client";
import DineroFactory from "dinero.js";
import { createDinero } from "@/lib/dinero/factory";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { InfoIcon } from "lucide-react";

export type MovementTableItem = {
  type: "payment" | "change" | "so-far";
  amount: number;
  paymentMethod?: EPaymentMethod;
}

type Props = {
  adjustedTotal: DineroFactory.Dinero;
}

export const ExchangeMovements: FC<Props> = ({
  adjustedTotal,
}) => {
  const form = useFormContext<FormSchema>();

  const saleMovements = useWatch({
    name: "sale.movements",
    control: form.control,
  });

  const fieldArray = useFieldArray<FormSchema, "movements">({
    name: "movements",
    control: form.control,
  });

  const paidBalance = useMemo(() => {
    if (!saleMovements) return undefined;

    return saleMovements.reduce((sum, { type, amount }) => {
      switch (type) {
        case "Change": return sum.subtract(createDinero(amount));
        case "Payment": return sum.add(createDinero(amount));
        default: throw new Error("Unmapped movement type.");
      }
    }, createDinero(0))
  }, [saleMovements]);

  const movementItems: MovementTableItem[] = useMemo(() => {
    const data: MovementTableItem[] = [];

    if (paidBalance) {
      data.push({
        type: "so-far",
        amount: paidBalance.toUnit(),
      });
    }

    fieldArray.fields.forEach((field) => {
      switch (field.type) {
        case "Change": return data.push({
          type: "change",
          amount: field.amount,
          paymentMethod: field.paymentMethod,
        });
        case "Payment": return data.push({
          type: "payment",
          amount: field.amount,
          paymentMethod: field.paymentMethod,
        });
        default: throw new Error("Unmapped movement type.");
      }
    });

    return data;
  }, [paidBalance, fieldArray.fields]);

  const currentPayment = useMemo(() => (
    movementItems.reduce((sum, item) => {
      switch (item.type) {
        case "change": return sum.subtract(createDinero(item.amount));
        case "payment": return sum.add(createDinero(item.amount));
        case "so-far": return sum.add(createDinero(item.amount));
        default: throw new Error("Unmapped movement type.");
      }
    }, createDinero(0))
  ), [movementItems]);

  const getMessage = useCallback(() => {
    const diff = adjustedTotal.subtract(currentPayment);

    if (diff.isZero()) return "A venda está quitada.";

    if (diff.isNegative()) {
      const changeStr = CurrencyFormatter.format(-diff.toUnit());
      return `O cliente deve receber ${changeStr} de troco.`;
    }

    const changeStr = CurrencyFormatter.format(diff.toUnit());
    return `${changeStr} pendentes de pagamento.`;
  }, [adjustedTotal, currentPayment]);

  return (
    <div className="flex-1 shrink-0 flex flex-col gap-2 overflow-x-auto">
      <Label>Movimentações</Label>

      <ExchangeMovimentsTable
        data={movementItems}
        currentPayment={currentPayment}
      />

      {saleMovements && (
        <div className="flex items-center gap-[6px] opacity-90">
          <InfoIcon size={15} strokeWidth={2.5} />

          <span className="text-sm font-medium">
            {getMessage()}
          </span>
        </div>
      )}
    </div>
  );
}