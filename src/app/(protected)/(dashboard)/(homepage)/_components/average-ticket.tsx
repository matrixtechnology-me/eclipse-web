import { ServerActionResult } from "@/types/server-actions";
import { GetAverageTicketActionResult } from "../_actions/get-average-ticket";
import { FC } from "react";
import { TicketIcon } from "lucide-react";
import { CurrencyFormatter } from "@/utils/formatters/currency";

type AverageTicketProps = {
  either: ServerActionResult<GetAverageTicketActionResult>;
};

export const AverageTicket: FC<AverageTicketProps> = ({ either }) => {
  if ("error" in either) {
    return <div>Não foi possível carregar o faturamento</div>;
  }

  const { averageTicket } = either.data;

  return (
    <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <TicketIcon className="size-4" />
        </div>
        <span className="font-bold">
          {CurrencyFormatter.format(averageTicket)}
        </span>
      </div>
      <div>
        <h1>Ticket Médio</h1>
        <p className="text-sm text-muted-foreground">Valor por venda</p>
      </div>
    </div>
  );
};
