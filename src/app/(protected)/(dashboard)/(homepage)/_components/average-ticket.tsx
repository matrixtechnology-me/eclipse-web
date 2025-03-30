import { ServerActionResult } from "@/types/server-actions";
import { GetAverageTicketActionResult } from "../_actions/get-average-ticket";
import { FC } from "react";
import { UsersIcon } from "lucide-react";
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
    <div className="flex-1 border border-secondary p-5">
      <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
        <UsersIcon className="size-4" />
      </div>
      <div>
        <h1>Valor médio de pedidos</h1>
        <span>{CurrencyFormatter.format(averageTicket)}</span>
      </div>
    </div>
  );
};
