import { FC } from "react";
import { getPosHistoryAction } from "../_actions/get-pos-history";

type HistoryProps = {
  posId: string;
};

export const History: FC<HistoryProps> = async ({ posId }) => {
  const result = await getPosHistoryAction({
    posId,
  });

  if (result.isFailure) {
    return <div>Não há nenhum evento</div>;
  }

  const { events } = result.value;

  return (
    <div>
      <h1>Histórico de transações</h1>
      <div>{JSON.stringify(events)}</div>
    </div>
  );
};
