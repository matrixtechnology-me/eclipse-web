export const PercentageFormatter = {
  format(value: number) {
    if (typeof value !== "number") {
      throw new Error("value must be a number.");
    }

    const formattedValue = value.toFixed(2) + "%";

    return formattedValue;
  },
  unformat(value: string) {
    if (typeof value !== "string") {
      throw new Error("value must be a string.");
    }

    const numericValue = value
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(numericValue);
  },
};
