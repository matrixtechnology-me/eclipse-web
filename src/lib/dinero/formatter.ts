import DineroFactory from "dinero.js";

// Formatter to be used with instances created by "createDinero" factory.
export const formatDinero = (dinero: DineroFactory.Dinero) => {
  return dinero.toFormat("$0,0.00", "DOWN"); // truncate
}