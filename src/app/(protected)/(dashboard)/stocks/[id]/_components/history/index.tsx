import { FC } from "react";
import { HistoryTable } from "./history-table";
import { getStockHistoryAction } from "../../_actions/get-stock-history";
import { AddStockEntry } from "./add-stock-entry";
import { AddStockOutput } from "./add-stock-output";
import { ClockIcon } from "lucide-react";

type HistoryProps = {
  stockId: string;
  stockLots: {
    id: string;
    lotNumber: string;
    totalQty: number;
  }[];
  tenantId: string;
};

export const History: FC<HistoryProps> = async ({
  stockId,
  tenantId,
  stockLots,
}) => {
  const result = await getStockHistoryAction({
    stockId,
    tenantId,
  });

  if (result.isFailure) {
    return <div>Não há nenhum evento</div>;
  }

  const { events } = result.value;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
            <ClockIcon className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">
              Histórico de transações
            </h1>
            <p className="text-muted-foreground text-xs">
              Veja todos os registros de movimentação do estoque
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <AddStockEntry stockId={stockId} stockLots={stockLots} />
          <AddStockOutput stockId={stockId} stockLots={stockLots} />
        </div>
      </div>
      {events.length === 0 ? (
        <div className="w-full min-h-72 border border-dashed rounded-lg flex items-center justify-center">
          <span>Nenhuma transação encontrada</span>
        </div>
      ) : (
        <HistoryTable data={events} />
      )}
    </div>
  );
};
