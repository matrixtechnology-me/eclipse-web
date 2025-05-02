import { FC } from "react";
import { DollarSignIcon } from "lucide-react";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { ServerActionResult } from "@/core/server-actions";
import { GetInvoicingActionResult } from "../_actions/get-invoicing";

type InvoicingProps = {
  result: ServerActionResult<GetInvoicingActionResult>;
};

export const Invoicing: FC<InvoicingProps> = ({ result }) => {
  if (result.isFailure) {
    return <div>Não foi possível carregar o faturamento</div>;
  }

  const { invoicing } = result.value;

  return (
    <div className="flex-1 border border-secondary p-5 bg-secondary/25 rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
          <DollarSignIcon className="size-4" />
        </div>
        <span className="text-sm md:text-md lg:text-lg font-bold">
          {CurrencyFormatter.format(invoicing)}
        </span>
      </div>
      <div>
        <h1 className="text-sm">Faturamento</h1>
        <p className="text-xs md:text-sm lg:text-md text-muted-foreground">
          Total acumulado
        </p>
      </div>
    </div>
  );
};
