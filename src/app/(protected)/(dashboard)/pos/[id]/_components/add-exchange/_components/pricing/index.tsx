import { ExchangeResume } from "./_components/resume";
import { ExchangeMovements } from "./_components/movements";
import { useExchange } from "../../_hooks/use-exchange";
import { ExchangeDiscountInput } from "./_components/discount";
import { Label } from "@/components/ui/label";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { SigmaIcon } from "lucide-react";

export const ExchangePricing = () => {
  const { resumeList, adjustedTotal, discountedTotal } = useExchange();

  return (
    <div className="flex flex-col gap-4">
      <ExchangeResume
        resumeList={resumeList}
        adjustedTotal={adjustedTotal.toUnit()}
      />

      <ExchangeDiscountInput />

      <div className="flex w-full items-center gap-2">
        <div className="flex items-center gap-2">
          <SigmaIcon size={22} />

          <Label className="text-[15px]">Valor final:</Label>
        </div>

        <span className="text-[15px] font-medium">
          {CurrencyFormatter.format(discountedTotal.toUnit())}
        </span>
      </div>

      <ExchangeMovements adjustedTotal={adjustedTotal} />
    </div>
  );
}