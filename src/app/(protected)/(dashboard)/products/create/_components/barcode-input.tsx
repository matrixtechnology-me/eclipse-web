import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import { PatternFormat } from "react-number-format";

export const BarcodeInput = forwardRef<
  HTMLInputElement,
  { onChange: (value: string) => void; value?: string; placeholder?: string }
>(({ onChange, value, placeholder, ...props }, ref) => (
  <PatternFormat
    getInputRef={ref}
    format="#############"
    mask="_"
    placeholder={placeholder}
    value={value}
    onValueChange={(values) => onChange(values.value)}
    customInput={Input}
    {...props}
  />
));
