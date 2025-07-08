import { Label } from "@/components/ui/label";
import { FC, useCallback, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../../../..";
import { ExchangeMovementsTable } from "./table";
import { EPaymentMethod } from "@prisma/client";
import DineroFactory from "dinero.js";
import { InfoIcon } from "lucide-react";
import { AddExchangeMovement } from "./add";
import { createBusinessDinero } from "@/lib/dinero/factory";
import { formatDinero } from "@/lib/dinero/formatter";

export type MovementTableItem = {
  type: "payment" | "change" | "so-far";
  amount: number;
  paymentMethod?: EPaymentMethod;
  fieldIndex?: number;
}

type Props = {
  // Dinero business instance with BUSINESS_PRECISION.
  finalAmount: DineroFactory.Dinero;
}

export const ExchangeMovements: FC<Props> = ({ finalAmount }) => {
  const form = useFormContext<FormSchema>();

  const saleMovements = useWatch({
    name: "sale.movements",
    control: form.control,
  });

  const fieldArray = useFieldArray<FormSchema, "movements">({
    name: "movements",
    control: form.control,
  });

  // Dinero business instance with BUSINESS_PRECISION.
  const paidBalance = useMemo(() => {
    if (!saleMovements) return undefined;

    return saleMovements.reduce((sum, { type, amount }) => {
      switch (type) {
        case "Change": return sum.subtract(createBusinessDinero(amount));
        case "Payment": return sum.add(createBusinessDinero(amount));
        default: throw new Error("Unmapped movement type.");
      }
    }, createBusinessDinero(0))
  }, [saleMovements]);

  const movementItems: MovementTableItem[] = useMemo(() => {
    const data: MovementTableItem[] = [];

    // For some reason 'isPositive' and 'isZero' are not mutual exclusive.
    if (paidBalance?.isPositive() && !paidBalance?.isZero()) {
      data.push({
        type: "so-far",
        amount: paidBalance.toUnit(),
      });
    }

    fieldArray.fields.forEach((field, index) => {
      switch (field.type) {
        case "Change": return data.push({
          type: "change",
          amount: field.amount,
          paymentMethod: field.paymentMethod,
          fieldIndex: index,
        });
        case "Payment": return data.push({
          type: "payment",
          amount: field.amount,
          paymentMethod: field.paymentMethod,
          fieldIndex: index,
        });
        default: throw new Error("Unmapped movement type.");
      }
    });

    return data;
  }, [paidBalance, fieldArray.fields]);

  // Dinero business instance with BUSINESS_PRECISION.
  const currentPayment = useMemo(() => (
    movementItems.reduce((sum, item) => {
      switch (item.type) {
        case "change": return sum.subtract(createBusinessDinero(item.amount));
        case "payment": return sum.add(createBusinessDinero(item.amount));
        case "so-far": return sum.add(createBusinessDinero(item.amount));
        default: throw new Error("Unmapped movement type.");
      }
    }, createBusinessDinero(0))
  ), [movementItems]);

  const getMessage = useCallback(() => {
    const diff = finalAmount.subtract(currentPayment);

    if (diff.isZero()) return "A venda está quitada.";

    if (diff.isNegative()) {
      const str = formatDinero(diff.multiply(-1));
      return `O cliente deve receber ${str} de troco.`;
    }

    return `${formatDinero(diff)} pendentes de pagamento.`;
  }, [finalAmount, currentPayment]);

  return (
    <div className="flex-1 shrink-0 flex flex-col gap-2 overflow-x-auto">
      <div className="flex items-center justify-between gap-3">
        <Label>Movimentações</Label>

        <AddExchangeMovement handleAppend={fieldArray.append} />
      </div>

      <ExchangeMovementsTable
        data={movementItems}
        currentPayment={currentPayment}
        removeField={fieldArray.remove}
      />

      {saleMovements && (
        <div className="flex items-center gap-[6px] opacity-90 mt-1">
          <InfoIcon size={18} strokeWidth={2.5} />

          <span className="text-[14.5px] font-medium leading-0.5">
            {getMessage()}
          </span>
        </div>
      )}
    </div>
  );
}