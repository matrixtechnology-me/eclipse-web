import DineroFactory from "dinero.js";

DineroFactory.globalLocale = "pt-BR";

const DECIMAL_PRECISION = 6;

// This factory works with DECIMAL_PRECISION and rounding.
// It transforms vanilla JS floating point numbers to Dinero instances.
// Dinero instances operate with integers to avoid floating point errors.

// Step by step with DECIMAL_PRECISION = 6:
// 1: 0.1234567
// 2: 0.1234567 * 1_000_000 = 123_456.7
// 3: Math.floor(123_456.7) = 123_456
// 4: Preserves 6 decimal places after operations

export const createDinero = (amount: number = 0) => {
  return DineroFactory({
    amount: Math.floor(amount * Math.pow(10, DECIMAL_PRECISION)),
    currency: "BRL",
    precision: DECIMAL_PRECISION,
  });
}
