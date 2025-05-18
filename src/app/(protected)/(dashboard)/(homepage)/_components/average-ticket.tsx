import { GetAverageTicketActionResult } from "../_actions/get-average-ticket";
import { FC } from "react";
import { TicketIcon } from "lucide-react";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { ActionResult } from "@/lib/action";

type AverageTicketProps = {
  result: ActionResult<GetAverageTicketActionResult>;
};

export const AverageTicket: FC<AverageTicketProps> = ({ result }) => {
  if (result.isFailure) {
    return <div>Não foi possível carregar o faturamento</div>;
  }

  const { averageTicket } = result.value;

  return (
    <div className="flex-1 border p-5 bg-secondary/25 rounded-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-sm bg-secondary flex items-center justify-center">
          <TicketIcon className="size-4" />
        </div>
        <span className="text-sm md:text-md lg:text-lg font-bold">
          {CurrencyFormatter.format(averageTicket)}
        </span>
      </div>
      <div>
        <h1 className="text-sm">Ticket Médio</h1>
        <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
          Valor por venda
        </p>
      </div>
    </div>
  );
};
