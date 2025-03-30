import { ServerActionResult } from "@/types/server-actions";
import { GetInvoicingActionResult } from "../_actions/get-invoicing";
import { FC } from "react";
import { UsersIcon } from "lucide-react";
import { CurrencyFormatter } from "@/utils/formatters/currency";

type InvoicingProps = {
  either: ServerActionResult<GetInvoicingActionResult>;
};

export const Invoicing: FC<InvoicingProps> = ({ either }) => {
  if ("error" in either) {
    return <div>Não foi possível carregar o faturamento</div>;
  }

  const { invoicing } = either.data;

  return (
    <div className="flex-1 border border-secondary p-5">
      <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
        <UsersIcon className="size-4" />
      </div>
      <div>
        <h1>Faturamento</h1>
        <span>{CurrencyFormatter.format(invoicing)}</span>
      </div>
    </div>
  );
};
