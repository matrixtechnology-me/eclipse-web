import React, { FC, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../../../..";
import { ExchangeResumeTable } from "./table";
import { Label } from "@/components/ui/label";

export type ResumeItem = {
  productId: string;
  name: string;
  salePrice: number;
  status: "unmodified" | "returned" | "replacement";
  quantity: number;
};

export const ExchangeResume: FC = () => {
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

      // Is not returned.
      if (returnBody == undefined) {
        data.push({
          ...saleItem,
          quantity: saleItem.totalQty,
          status: "unmodified",
        });
        continue;
      };

      // Add returned unities.
      data.push({
        ...saleItem,
        quantity: returnBody.totalQty,
        status: "returned",
      });

      const returnDiff = saleItem.totalQty - returnBody.totalQty;
      const completelyReturned = returnDiff == 0;

      // Check for remaining unities.
      if (!completelyReturned) {
        data.push({
          ...saleItem,
          quantity: returnDiff,
          status: "unmodified",
        });
      }
    }

    // Add exchanged unities.
    for (const replaementProd of replacementProducts) {
      data.push({
        ...replaementProd,
        status: "replacement",
      });
    }

    return data.sort((a, b) => a.productId.localeCompare(b.productId));
  }, [sale, returnedProducts, replacementProducts]);

  return (
    <div className="shrink-0 flex flex-col gap-2 overflow-x-auto">
      <Label>Resumo</Label>

      <ExchangeResumeTable data={resumeList} />
    </div>
  );
}