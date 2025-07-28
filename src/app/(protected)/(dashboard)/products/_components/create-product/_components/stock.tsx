import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormContext, useWatch } from "react-hook-form";
import { CreateProductSchema } from "../_utils/validations/create-product";
import { CurrencyInput } from "./currency-input";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./date-picker";

export const StockInput = () => {
  const form = useFormContext<CreateProductSchema>();

  const stock = useWatch({
    name: "stock",
    control: form.control,
  });

  const handleToggleStock = (toggle: boolean) => {
    const payload: CreateProductSchema["stock"] = toggle
      ? { costPrice: 0, initialQuantity: 0, expiresAt: undefined }
      : undefined;

    form.setValue("stock", payload, { shouldValidate: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            id="stock-switch"
            checked={!!stock}
            onCheckedChange={handleToggleStock}
          />
          <Label htmlFor="stock-switch">
            Configurar estoque inicial
          </Label>
        </div>
        {!stock && (
          <span className="text-xs text-muted-foreground">
            Estoque inicial desativado
          </span>
        )}
      </div>

      {!!stock && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-semibold tracking-tight">
                Estoque inicial
              </h1>
              <p className="text-muted-foreground text-xs">
                Defina a quantidade, custo e data de validade do
                lote inicial.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="stock.costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Custo*</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      placeholder="R$ 0,00"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock.initialQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade inicial*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Insira a quantidade inicial"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock.expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de validade (opcional)</FormLabel>
                  <FormControl>
                    <DatePicker
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}