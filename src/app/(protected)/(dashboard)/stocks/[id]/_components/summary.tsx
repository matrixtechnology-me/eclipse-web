import { FC } from "react";
import { getStockSummaryAction } from "../_actions/get-stock-summary";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Warehouse,
  DollarSign,
} from "lucide-react";

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

  const { entriesCount, outputsCount, balance, profitProjection } =
    result.value;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Entradas */}
      <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
            <ArrowDownCircle className="size-4" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-bold">
            {entriesCount}
          </span>
        </div>
        <div>
          <h1 className="text-sm">{entriesCount} registros</h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Entradas no estoque
          </p>
        </div>
      </div>

      {/* Saídas */}
      <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
            <ArrowUpCircle className="size-4" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-bold">
            {outputsCount}
          </span>
        </div>
        <div>
          <h1 className="text-sm">{outputsCount} registros</h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Saídas do estoque
          </p>
        </div>
      </div>

      {/* Valor do estoque */}
      <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
            <Warehouse className="size-4" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-bold">
            {entriesCount - outputsCount}
          </span>
        </div>
        <div>
          <h1 className="text-sm">{CurrencyFormatter.format(balance)}</h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Valor total do estoque (custo)
          </p>
        </div>
      </div>

      {/* Projeção de lucro */}
      <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
            <DollarSign className="size-4" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-bold">
            {entriesCount - outputsCount}
          </span>
        </div>
        <div>
          <h1 className="text-sm">
            {CurrencyFormatter.format(profitProjection)}
          </h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Projeção de lucro
          </p>
        </div>
      </div>
    </div>
  );
};
