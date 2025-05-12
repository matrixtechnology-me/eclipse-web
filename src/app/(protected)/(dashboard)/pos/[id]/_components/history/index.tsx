import { FC } from "react";
import { getPosHistoryAction } from "../../_actions/get-pos-history";
import { HistoryTable } from "./history-table";
import { ClockIcon } from "lucide-react";

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
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <ClockIcon className="size-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">
            Histórico de transações
          </h1>
          <p className="text-muted-foreground text-xs">
            Veja todos os registros de movimentação do caixa
          </p>
        </div>
      </div>
      {events.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          Não há nenhum evento
        </div>
      ) : (
        <HistoryTable data={events} posId={posId} tenantId={tenantId} />
      )}
    </div>
  );
};
