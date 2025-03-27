export const NumericParser = {
  parse(value: string) {
    const numericValue = value
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return numericValue;
  }
}
