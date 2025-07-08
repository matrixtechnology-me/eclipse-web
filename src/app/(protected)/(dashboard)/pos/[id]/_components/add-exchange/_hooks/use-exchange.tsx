import { useMemo } from "react";
import { FormSchema } from ".."
import { ExchangeResumeItem, ExchangeResumeItemStatus } from "../_types/resume";
import { useFormContext, useWatch } from "react-hook-form";
import { createDinero } from "@/lib/dinero/factory";
import DineroFactory from "dinero.js";
import { toBusinessPrecision } from "@/lib/dinero/converter";

/* 
  Status "kept" (mantido):
  - Produto presente na venda continua na venda.
  - Mantém-se seu subtotal na venda, sem alterações.

  Status "new" (novo):
  - Produto novo na venda foi levado; esse mesmo produto não pode ter status "kept".
  - Adiciona-se ao valor da venda seu subtotal de acordo com seu preço atual.

  Status "added" (acrescentado): 
  - Produto presente na venda foi levado; sua quantidade total aumentou.
  - Quantidade levada deve ser somada à quantidade presente na venda.
  - Adiciona-se ao valor da venda seu subtotal, de acordo com a quantidade atualizada e com seu preço atual.
  - Devido possíveis mudanças de preço, o estabelecimento decide se desconta algum valor.

  Status "returned" (devolvido):
  - Produto presente na venda foi devolvido.
  - Remove-se do valor da venda seu sobtotal na última operação.
*/

export const useExchange = () => {
  const form = useFormContext<FormSchema>();

  const [sale, returnedItems, replacementItems, discount] = useWatch({
    name: ["sale", "products.returned", "products.replacement", "discount"],
    control: form.control,
  });

  // List of items to be shown on resume table.
  const resumeList = useMemo((): ExchangeResumeItem[] => {
    let data: ExchangeResumeItem[] = [];

    (sale?.products || []).forEach((saleItem) => {
      const field = returnedItems.find(i => i.productId == saleItem.productId);

      // Add kept unities, item was not returned.
      if (!field) return data.push({
        ...saleItem,
        quantity: saleItem.totalQty,
        status: "kept",
      });

      // Add returned unities.
      data.push({
        ...saleItem,
        quantity: field.totalQty,
        status: "returned",
      });

      const returnDiff = saleItem.totalQty - field.totalQty;

      // Check for remaining unities (partial return).
      if (returnDiff != 0) {
        data.push({
          ...saleItem,
          quantity: returnDiff,
          status: "kept",
        });
      }
    });

    replacementItems.forEach((newProd) => {
      // Check if the new item already was in the sale.
      const relatedKept = data.find(
        p => p.status === "kept" && p.productId === newProd.productId
      );

      // Item is completely new.
      if (!relatedKept) return data.push({
        ...newProd,
        status: "new",
      });

      // Item is incremented.
      data.push({
        ...newProd,
        quantity: newProd.quantity + relatedKept.quantity,
        status: "incremented",
      });

      // Remove unities with "kept" status.
      data = data.filter(
        p => !(p.status === "kept" && p.productId === newProd.productId)
      );
    });

    return data.sort((a, b) => a.productId.localeCompare(b.productId));
  }, [sale?.products, returnedItems, replacementItems]);

  // Estimated value of the sale after the exchange.
  const adjustedTotal = useMemo(() => (
    resumeList.reduce((sum, item) => {
      const { status, salePrice, quantity } = item;

      const relevantStatus: ExchangeResumeItemStatus[] = [
        "new", "incremented", "kept",
      ];

      if (!relevantStatus.includes(status)) return sum;

      const subtotal = createDinero(salePrice).multiply(quantity);
      return sum.add(subtotal);
    }, createDinero(0))
  ), [resumeList]);

  const discountedTotal = useMemo(() => {
    const exact = applyDiscount(adjustedTotal, discount);

    return toBusinessPrecision(exact);
  }, [adjustedTotal, discount]);

  return { resumeList, adjustedTotal, discountedTotal };
}

type Discount = {
  value: number;
  type: "cash" | "percentage";
}

const applyDiscount = (
  instance: DineroFactory.Dinero,
  discount?: Discount,
): DineroFactory.Dinero => {
  if (!discount) return instance;

  switch (discount.type) {
    case "cash":
      return instance.subtract(createDinero(discount.value));
    case "percentage": {
      const discountAmount = instance.multiply(discount.value);
      return instance.subtract(discountAmount);
    }
    default: throw new Error("Unmapped discount type.");
  }
}