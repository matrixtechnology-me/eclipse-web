/* 
  Parse numbers to dinero 'amount' property based on:
    - currency sub-unities;
    - precision.

  Examples (precision 2):
    100         -> 10000
    99          -> 9900
    69.96       -> 69.96
    69.9642     -> 69.96
    69.9612345  -> 69.96

  Examples (precision 6):
    100         -> 100000000
    99          -> 99000000
    69.96       -> 69.960000
    69.9642     -> 69.964200
    69.9612345  -> 69.961234
*/

export const parseToDineroAmount = (
  input: number,
  precision: number,
): number => {
  if (Number.isInteger(input)) return input * Math.pow(10, precision);

  const [int, frac] = input.toString().split('.');

  const fracStr = frac + "0".repeat(Math.max(precision - frac.length, 0));
  const finalFrac = fracStr.substring(0, precision);

  return Number.parseInt(int + finalFrac);
}