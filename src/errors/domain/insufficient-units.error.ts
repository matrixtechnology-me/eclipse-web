export class InsufficientUnitsError extends Error {
  constructor(stockId: string) {
    super(`Not enough units in Stock '${stockId}'.`);
  }
}
