import { PricingCalculationError } from "@/errors/domain/pricing-calculation.error";
import { createDinero } from "@/lib/dinero/factory";
import { EDiscountVariant } from "@prisma/client";
import DineroFactory from "dinero.js";

export type Discount = {
  amount: number;
  type: EDiscountVariant;
}

export class SalePricingCalculator {
  // todo: unit tests.
  public static applyDiscount(
    instance: DineroFactory.Dinero,
    discount?: Discount,
  ): DineroFactory.Dinero {
    if (!discount) return instance;

    switch (discount.type) {
      case "Amount":
        return instance.subtract(createDinero(discount.amount));
      case "Percentage": {
        const discountAmount = instance.multiply(discount.amount);
        return instance.subtract(discountAmount);
      }
      default: throw new PricingCalculationError("Unmapped discount type.");
    }
  }
}