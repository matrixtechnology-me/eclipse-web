import { useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "../../../..";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { NumericParser } from "@/utils/parsers/numeric";
import { Label } from "@/components/ui/label";

export const ExchangeDiscountInput = () => {
  const form = useFormContext<FormSchema>();

  const [watched, sale] = useWatch({
    name: ["discount", "sale"],
    control: form.control,
  });

  const toggleDiscount = (toggle: Boolean) => {
    let payload: FormSchema["discount"] = {
      type: "cash",
      value: 0.0,
    };

    if (!toggle) payload = undefined;
    form.setValue("discount", payload, { shouldTouch: true });
  }

  const handleVariantChange = (type: "cash" | "percentage") => {
    form.setValue("discount", {
      type,
      value: 0.0,
    }, { shouldTouch: true });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex items-center gap-3 justify-between">
        <Label>Desconto</Label>

        <Switch
          checked={!!watched}
          disabled={!sale}
          onCheckedChange={toggleDiscount}
        />
      </div>

      {!!watched && (
        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="discount.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variante</FormLabel>

                <FormMessage />

                <FormControl>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={handleVariantChange}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue
                        className="truncate"
                        placeholder="Escolha uma variante de desconto"
                      />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="cash">Dinheiro</SelectItem>

                      <SelectItem value="percentage">
                        Porcentagem
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantia</FormLabel>

                <FormControl>
                  <NumericFormat
                    customInput={Input}
                    disabled={!watched}
                    className="h-9"
                    placeholder="Valor do desconto"
                    prefix={
                      watched.type === "cash" ? "R$" : undefined
                    }
                    suffix={
                      watched.type === "percentage" ? "%" : undefined
                    }
                    decimalScale={2}
                    fixedDecimalScale={true}
                    thousandSeparator={
                      watched.type === "cash" ? "." : undefined
                    }
                    decimalSeparator=","
                    name={field.name}
                    value={(() => {
                      switch (watched.type) {
                        case "cash": return field.value;
                        case "percentage": return field.value * 100;
                        default:
                          throw new Error("NumericFormat: unmapped variant.");
                      }
                    })()}
                    onChange={({ target }) => {
                      const numericStr = NumericParser.parse(
                        target.value
                      );
                      const value = Number(numericStr);

                      switch (watched.type) {
                        case "cash": return field.onChange(value);
                        case "percentage": return field.onChange(value / 100);
                        default:
                          throw new Error("NumericFormat: unmapped variant.");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}