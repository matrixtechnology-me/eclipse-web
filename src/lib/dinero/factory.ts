import DineroFactory from "dinero.js";
import { parseToDineroAmount } from "./parser";

DineroFactory.globalLocale = "pt-BR";

/*
  Dinero instances operate with integers to avoid vanilla JS floating point 
  numbers arithmetic errors.
  Precision is the number of decimal places preserved after operations.
  
  Internal representation with precision = 6:
    0.1234567     -> 123_456
    123.456789123 -> 123_456_789
*/

const DECIMAL_PRECISION = 6;

export const createDinero = (input: number = 0) => {
  return DineroFactory({
    amount: parseToDineroAmount(input, DECIMAL_PRECISION),
    currency: "BRL",
    precision: DECIMAL_PRECISION,
  });
}

export const BUSINESS_PRECISION = 2;

export const createBusinessDinero = (input: number = 0) => {
  return DineroFactory({
    amount: parseToDineroAmount(input, BUSINESS_PRECISION),
    currency: "BRL",
    precision: BUSINESS_PRECISION,
  });
}
