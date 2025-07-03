import { ExchangeResume } from "./_components/resume";
import { ExchangeMovements } from "./_components/movements";
import { useExchange } from "../../_hooks/use-exchange";

export const ExchangePricing = () => {
  const { resumeList, adjustedTotal } = useExchange();

  return (
    <div className="flex flex-col gap-4">
      <ExchangeResume
        resumeList={resumeList}
        adjustedTotal={adjustedTotal.toUnit()}
      />

      <ExchangeMovements adjustedTotal={adjustedTotal} />
    </div>
  );
}