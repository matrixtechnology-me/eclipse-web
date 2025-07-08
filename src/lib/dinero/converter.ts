import DineroFactory from "dinero.js";
import { BUSINESS_PRECISION } from "./factory";

// Converts instances to business goals (final amounts, presenting, etc).
export const toBusinessPrecision = (instance: DineroFactory.Dinero) => {
  return instance.convertPrecision(BUSINESS_PRECISION, "DOWN"); // truncate
}