import { ExchangeResume } from "./_components/resume";
import { ExchangeMovements } from "./_components/movements";
import { useExchange } from "../../_hooks/use-exchange";
import { ExchangeDiscountInput } from "./_components/discount";

export const ExchangePricing = () => {
  const { resumeList, adjustedTotal } = useExchange();

  return (
    <div className="flex flex-col gap-4">
      <ExchangeResume
        resumeList={resumeList}
        adjustedTotal={adjustedTotal.toUnit()}
      />

      <ExchangeDiscountInput />

      <ExchangeMovements adjustedTotal={adjustedTotal} />
    </div>
  );
}