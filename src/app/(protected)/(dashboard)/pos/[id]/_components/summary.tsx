import { FC } from "react";
import { getPosSummaryAction } from "../_actions/get-pos-summary";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

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
      <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
            <ArrowDownCircle className="size-4" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-bold">
            {entries.count}
          </span>
        </div>
        <div>
          <h1 className="text-sm">
            {CurrencyFormatter.format(entries.amount)}
          </h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Entradas registradas
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
            {outputs.count}
          </span>
        </div>
        <div>
          <h1 className="text-sm">
            {CurrencyFormatter.format(outputs.amount)}
          </h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Saídas registradas
          </p>
        </div>
      </div>

      {/* Vendas */}
      <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
            <ShoppingCart className="size-4" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-bold">
            {sales.count}
          </span>
        </div>
        <div>
          <h1 className="text-sm">{CurrencyFormatter.format(sales.amount)}</h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Vendas realizadas
          </p>
        </div>
      </div>

      {/* Balanço */}
      <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
            <DollarSign className="size-4" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-bold">
            {entries.count + outputs.count + sales.count}
          </span>
        </div>
        <div>
          <h1 className="text-sm">{CurrencyFormatter.format(balance)}</h1>
          <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
            Balanço total
          </p>
        </div>
      </div>
    </div>
  );
};
