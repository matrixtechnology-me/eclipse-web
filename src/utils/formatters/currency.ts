export const CurrencyFormatter = {
  format(value: number) {
    if (typeof value !== "number") {
      throw new Error("value must be a number.");
    }

    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
      roundingMode: "ceil",
    }).format(value);

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
