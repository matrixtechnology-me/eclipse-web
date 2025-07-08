import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { FormSchema } from "../..";
import { CustomerAsyncSelect } from "@/components/domain/entities/customer-async-select";
import { FC, useState } from "react";
import { CustomerSalesTable } from "./sales-table";
import { Button } from "@/components/ui/button";

type Props = {
  tenantId: string;
  onCancel: () => void;
  onContinue: () => void;
}

export const ExchangeSaleFormStep: FC<Props> = ({
  tenantId,
  onCancel,
  onContinue,
}) => {
  const [validating, setValidating] = useState<boolean>(false);
  const form = useFormContext<FormSchema>();

  async function handleContinue() {
    setValidating(true);

    try {
      const formValidations = await Promise.all([
        form.trigger("customerId", { shouldFocus: true }),
        form.trigger("sale", { shouldFocus: true }),
      ]);

      if (formValidations.some(validation => !validation)) return;
      onContinue();

    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <FormMessage />
            <FormControl>
              <CustomerAsyncSelect
                {...field}
                onValueChange={field.onChange}
                tenantId={tenantId}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <CustomerSalesTable tenantId={tenantId} />

      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>

        <Button
          type="button"
          disabled={validating}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}