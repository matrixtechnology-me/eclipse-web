import { FC } from "react";
import { getPosSummaryAction } from "../_actions/get-pos-summary";
import { CurrencyFormatter } from "@/utils/formatters/currency";

type SummaryProps = {
  posId: string;
  tenantId: string;
};

export const Summary: FC<SummaryProps> = async ({ posId, tenantId }) => {
  const result = await getPosSummaryAction({ posId, tenantId });

  if (result.isFailure) {
    return <div>Erro ao obter resumo</div>;
  }

  const { entries, outputs, sales, balance } = result.value;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Entradas */}
      <div className="border p-4 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Entradas</h2>
        <p className="text-3xl font-bold">
          {CurrencyFormatter.format(entries.amount)}
        </p>
        <span className="text-xs text-muted-foreground">
          {entries.count} {entries.count > 1 ? "operações" : "operação"}
        </span>
      </div>

      {/* Saídas */}
      <div className="border p-4 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Saídas</h2>
        <p className="text-3xl font-bold">
          {CurrencyFormatter.format(outputs.amount)}
        </p>
        <span className="text-xs text-muted-foreground">
          {outputs.count} {outputs.count > 1 ? "operações" : "operação"}
        </span>
      </div>

      {/* Vendas */}
      <div className="border p-4 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Vendas</h2>
        <p className="text-3xl font-bold">
          {CurrencyFormatter.format(sales.amount)}
        </p>
        <span className="text-xs text-muted-foreground">
          {sales.count} {sales.count > 1 ? "operações" : "operação"}
        </span>
      </div>

      {/* Balanço */}
      <div className="border p-4 rounded-lg flex flex-col items-center">
        <h2 className="text-xl font-semibold">Balanço</h2>
        <p className="text-3xl font-bold">
          {CurrencyFormatter.format(balance)}
        </p>
        <span className="text-xs text-muted-foreground">
          {entries.count + outputs.count + sales.count}{" "}
          {entries.count + outputs.count + sales.count > 1
            ? "operações"
            : "operação"}
        </span>
      </div>
    </div>
  );
};
