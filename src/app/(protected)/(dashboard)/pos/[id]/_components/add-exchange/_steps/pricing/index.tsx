import { ExchangeResume } from "./_components/resume";
import { ExchangeMovements } from "./_components/movements";
import { useExchange } from "../../_hooks/use-exchange";
import { ExchangeDiscountInput } from "./_components/discount";
import { Label } from "@/components/ui/label";
import { SigmaIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormSchema } from "../..";
import { formatDinero } from "@/lib/dinero/formatter";

type Props = {
  onPrev: () => void;
  onContinue: () => void;
}

export const ExchangePricingFormStep: FC<Props> = ({
  onPrev,
  onContinue,
}) => {
  const [validating, setValidating] = useState<boolean>(false);
  const form = useFormContext<FormSchema>();

  const { resumeList, adjustedTotal, discountedTotal } = useExchange();

  async function handleContinue() {
    setValidating(true);

    try {
      const formValidations = await Promise.all([
        form.trigger("discount", { shouldFocus: true }),
        form.trigger("movements", { shouldFocus: true }),
      ]);

      if (formValidations.some(validation => !validation)) return;
      onContinue();

    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <ExchangeResume
        resumeList={resumeList}
        adjustedTotal={adjustedTotal}
      />

      <ExchangeDiscountInput />

      <Separator />

      <div className="flex w-full items-center gap-2">
        <div className="flex items-center gap-2">
          <SigmaIcon size={22} />

          <Label className="text-[15px]">Valor final:</Label>
        </div>

        <span className="text-[15px] font-medium">
          {formatDinero(discountedTotal)}
        </span>
      </div>

      <ExchangeMovements finalAmount={discountedTotal} />

      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" variant="outline" onClick={onPrev}>
          Voltar
        </Button>

        <Button
          type="button"
          disabled={validating || form.formState.isSubmitting}
          onClick={handleContinue}
        >
          {form.formState.isSubmitting
            ? "Salvando alterações..."
            : "Salvar alterações"
          }
        </Button>
      </div>
    </div>
  );
}