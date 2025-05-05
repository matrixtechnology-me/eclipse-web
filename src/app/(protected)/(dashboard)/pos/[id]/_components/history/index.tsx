import { FC } from "react";
import { getPosHistoryAction } from "../../_actions/get-pos-history";
import { HistoryTable } from "./history-table";

type HistoryProps = {
  posId: string;
  tenantId: string;
};

export const History: FC<HistoryProps> = async ({ posId, tenantId }) => {
  const result = await getPosHistoryAction({
    posId,
    tenantId,
  });

  if (result.isFailure) {
    return <div>Não há nenhum evento</div>;
  }

  const { events } = result.value;

  return (
    <div>
      <h1>Histórico de transações</h1>
      {events.length === 0 ? (
        <div>Não há nenhum evento</div>
      ) : (
        <HistoryTable data={events} posId={posId} tenantId={tenantId} />
      )}
    </div>
  );
};
