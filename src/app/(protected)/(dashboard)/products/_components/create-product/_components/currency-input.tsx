import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { NumericFormat } from "react-number-format";

export const CurrencyInput = forwardRef<
  HTMLInputElement,
  { onChange: (value: number) => void; value?: number; placeholder?: string }
>(({ onChange, value, placeholder, ...props }, ref) => (
  <NumericFormat
    getInputRef={ref}
    thousandSeparator="."
    decimalSeparator=","
    prefix="R$"
    allowNegative={false}
    decimalScale={2}
    fixedDecimalScale
    placeholder={placeholder}
    value={value === 0 ? "" : value}
    onValueChange={({ floatValue }) => {
      onChange(floatValue ?? 0);
    }}
    onFocus={(e) => {
      if (value === 0) {
        e.currentTarget.setSelectionRange(
          e.currentTarget.value.length,
          e.currentTarget.value.length
        );
      }
    }}
    customInput={Input}
    {...props}
  />
));
