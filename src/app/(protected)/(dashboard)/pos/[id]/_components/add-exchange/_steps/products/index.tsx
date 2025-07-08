import { FC, useState } from "react";
import { ExchangeReturnedProducts } from "./returned";
import { ExchangeReplacementProducts } from "./replacement";
import { useFormContext } from "react-hook-form";
import { FormSchema } from "../..";
import { Button } from "@/components/ui/button";

type Props = {
  tenantId: string;
  onPrev: () => void;
  onContinue: () => void;
}

export const ExchangeProductsFormStep: FC<Props> = ({
  tenantId,
  onPrev,
  onContinue,
}) => {
  const [validating, setValidating] = useState<boolean>(false);
  const form = useFormContext<FormSchema>();

  async function handleContinue() {
    setValidating(true);

    try {
      const formValidations = await Promise.all([
        form.trigger("products.returned", { shouldFocus: true }),
        form.trigger("products.replacement", { shouldFocus: true }),
      ]);

      if (formValidations.some(validation => !validation)) return;
      onContinue();

    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <ExchangeReturnedProducts />

      <ExchangeReplacementProducts tenantId={tenantId} />

      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" variant="outline" onClick={onPrev}>
          Voltar
        </Button>

        <Button type="button" disabled={validating} onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}