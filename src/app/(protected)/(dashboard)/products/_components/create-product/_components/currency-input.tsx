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
    decimalScale={2}
    fixedDecimalScale
    prefix="R$ "
    placeholder={placeholder}
    value={value}
    onValueChange={(values) => onChange(values.floatValue ?? 0)}
    customInput={Input}
    {...props}
  />
));
