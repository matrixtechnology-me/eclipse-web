import { EPaymentMethod } from "@prisma/client";

export const PaymentMethodPresenter = {
  present(value: EPaymentMethod) {
    const map: Record<EPaymentMethod, string> = {
      Cash: "Dinheiro",
      CreditCard: "Cartão de Crédito",
      DebitCard: "Cartão de Débito",
      Pix: "Pix",
    };

    return map[value];
  },
}