import { ProductionType } from "@prisma/client";

export const ProductionTypePresenter = {
  present(value: ProductionType) {
    const map: Record<ProductionType, string> = {
      Outsourced: "Terceirizada",
      Own: "Própria",
    };

    return map[value];
  },
}