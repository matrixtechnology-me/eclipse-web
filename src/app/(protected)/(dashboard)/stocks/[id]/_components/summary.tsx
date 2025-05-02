import { FC } from "react";
import { getStockSummaryAction } from "../_actions/get-stock-summary";

type StockSummaryProps = {
  stockId: string;
  tenantId: string;
};

export const StockSummary: FC<StockSummaryProps> = async ({
  stockId,
  tenantId,
}) => {
  const result = await getStockSummaryAction({ stockId, tenantId });

  if (result.isFailure) {
    return <div>Erro ao obter resumo de estoque</div>;
  }

  const { entriesCount, outputsCount, balance } = result.value;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="border p-4 shadow-lg rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Entradas</h2>
        <p className="text-3xl font-bold">{entriesCount}</p>
      </div>
      <div className="border p-4 shadow-lg rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Saídas</h2>
        <p className="text-3xl font-bold">{outputsCount}</p>
      </div>
      <div className="border p-4 shadow-lg rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Balanço</h2>
        <p className="text-3xl font-bold">{balance}</p>
      </div>
    </div>
  );
};
