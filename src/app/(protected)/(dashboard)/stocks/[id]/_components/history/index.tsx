import { FC } from "react";
import { HistoryTable } from "./history-table";
import { getStockHistoryAction } from "../../_actions/get-stock-history";
import { AddStockEntry } from "./add-stock-entry";
import { AddStockOutput } from "./add-stock-output";

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
        <h1>Histórico de eventos de estoque</h1>
        <div className="grid grid-cols-2 gap-2">
          <AddStockEntry stockId={stockId} stockLots={stockLots} />
          <AddStockOutput stockId={stockId} stockLots={stockLots} />
        </div>
      </div>
      {events.length === 0 ? (
        <div>Não há nenhum evento</div>
      ) : (
        <HistoryTable data={events} />
      )}
    </div>
  );
};
