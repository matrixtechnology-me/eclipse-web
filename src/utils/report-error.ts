import { CustomError } from "@/errors/custom";
import { propagateError } from "./propagate-error";
import { UnexpectedError } from "@/errors";

export const reportError = (_: unknown) => {
  // carry out all necessary measures to deal with the unexpected error
  const fakeError = new UnexpectedError();
  return propagateError(fakeError as CustomError);
};
