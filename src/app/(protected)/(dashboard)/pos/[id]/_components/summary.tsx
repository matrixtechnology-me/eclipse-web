import { FC } from "react";
import { getPosSummaryAction } from "../_actions/get-pos-summary";

type SummaryProps = {
  posId: string;
};

export const Summary: FC<SummaryProps> = async ({ posId }) => {
  const result = await getPosSummaryAction({ posId });

  if (result.isFailure) {
    return <div>Erro ao obter resumo</div>;
  }

  const { entriesCount, outputsCount, salesCount, balance } = result.value;

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
        <h2 className="text-xl font-semibold">Vendas</h2>
        <p className="text-3xl font-bold">{salesCount}</p>
      </div>
      <div className="border p-4 shadow-lg rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Balanço</h2>
        <p className="text-3xl font-bold">R$ {balance.toFixed(2)}</p>
      </div>
    </div>
  );
};
