import { ESaleMovementType } from "@prisma/client";

export const SaleMovementTypePresenter = {
  present(value: ESaleMovementType) {
    const map: Record<ESaleMovementType, string> = {
      Change: "Troco",
      Payment: "Pagamento",
      Refund: "Extorno",
      Withdrawal: "Cancelamento",
    };

    return map[value];
  },
}