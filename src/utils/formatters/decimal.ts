export const DecimalFormatter = {
  format(value: number) {
    if (typeof value !== "number") {
      throw new Error("value must be a number.");
    }

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: false,
    }).format(value);
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
