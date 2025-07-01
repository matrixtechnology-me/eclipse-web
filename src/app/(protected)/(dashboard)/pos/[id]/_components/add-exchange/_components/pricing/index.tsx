import { useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../..";
import { useMemo } from "react";
import { createDinero } from "@/lib/dinero/factory";
import { ExchangeResume } from "./_components/resume";
import { ExchangeMovements } from "./_components/movements";

export type ResumeItem = {
  productId: string;
  name: string;
  salePrice: number;
  status: "unmodified" | "returned" | "replacement";
  quantity: number;
};

export const ExchangePricing = () => {
  const form = useFormContext<FormSchema>();

  const [sale, returnedProducts, replacementProducts] = useWatch({
    name: ["sale", "products.returned", "products.replacement"],
    control: form.control,
  });

  const resumeList: ResumeItem[] = useMemo(() => {
    if (!sale) return [];
    const data: ResumeItem[] = [];

    for (const saleItem of sale.products) {
      const returnBody =
        returnedProducts.find(p => p.productId == saleItem.productId);

      // If not returned
      if (returnBody == undefined) {
        data.push({
          ...saleItem,
          quantity: saleItem.totalQty,
          status: "unmodified",
        });
        continue;
      };

      const returnedQty = returnBody.totalQty

      data.push({
        ...saleItem,
        quantity: returnedQty,
        status: "returned",
      });

      const returnDiff = saleItem.totalQty - returnedQty;
      const completelyReturned = returnDiff == 0;

      // Check for remaining qty
      if (!completelyReturned) {
        data.push({
          ...saleItem,
          quantity: returnDiff,
          status: "unmodified",
        });
      }
    }

    // Add new products qty
    for (const replacementProduct of replacementProducts) {
      data.push({
        ...replacementProduct,
        status: "replacement",
      });
    }

    return data.sort((a, b) => a.productId.localeCompare(b.productId));
  }, [sale, returnedProducts, replacementProducts]);

  const adjustedTotal = useMemo(() => (
    resumeList.reduce((sum, item) => {
      const { status, salePrice, quantity } = item;
      const subtotal = createDinero(salePrice).multiply(quantity);

      switch (status) {
        case "replacement": return sum.add(subtotal);
        case "unmodified": return sum.add(subtotal);
        case "returned": return sum;
        default: throw new Error("Unmapped resume item status.");
      };
    }, createDinero(0))
  ), [resumeList]);

  return (
    <div className="flex flex-col gap-4">
      <ExchangeResume
        resumeList={resumeList}
        adjustedTotal={adjustedTotal.toUnit()}
      />

      <ExchangeMovements adjustedTotal={adjustedTotal} />
    </div>
  );
}